import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/**
 * Root check
 */
app.get("/", (req, res) => {
  res.send("Open-Cookie Activity Tracker Backend is running 🚀");
});

/**
 * GitHub OAuth endpoints
 */
app.get("/auth/github", (req, res) => {
  const redirectUri = `${req.protocol}://${req.get('host')}/auth/github/callback`;
  const scope = 'user:email,repo';
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
  
  res.redirect(githubAuthUrl);
});

app.get("/auth/github/callback", async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: "Authorization code not provided" });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: code
    }, {
      headers: {
        'Accept': 'application/json'
      }
    });

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      return res.status(400).json({ error: "Failed to get access token" });
    }

    // Get user info
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${access_token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const user = userResponse.data;

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080/';
    res.redirect(`${frontendUrl}dashboard?token=${access_token}&user=${encodeURIComponent(JSON.stringify(user))}`);
    
  } catch (error) {
    console.error('GitHub OAuth error:', error.message);
    res.status(500).json({ error: "Authentication failed" });
  }
});

/**
 * Get user repositories
 */
app.get("/api/user/repos", async (req, res) => {
  const { token: userToken } = req.headers;
  
  if (!userToken) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        'Authorization': `token ${userToken}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      params: {
        sort: 'updated',
        per_page: 100
      }
    });

    const repos = response.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      private: repo.private,
      html_url: repo.html_url,
      updated_at: repo.updated_at,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      open_issues_count: repo.open_issues_count
    }));

    res.json({ repos });
  } catch (error) {
    console.error('Error fetching user repos:', error.message);
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
});

/**
 * Get user info
 */
app.get("/api/user", async (req, res) => {
  const { token: userToken } = req.headers;
  
  if (!userToken) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${userToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const user = {
      id: response.data.id,
      login: response.data.login,
      name: response.data.name,
      email: response.data.email,
      avatar_url: response.data.avatar_url,
      html_url: response.data.html_url,
      public_repos: response.data.public_repos,
      followers: response.data.followers,
      following: response.data.following
    };

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user info:', error.message);
    res.status(500).json({ error: "Failed to fetch user information" });
  }
});

const token = process.env.GITHUB_TOKEN || "your_github_token_here";
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Validate GitHub token
if (!process.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN === "your_github_token_here") {
  console.error("❌ GITHUB_TOKEN environment variable is not set!");
  console.error("Please create a .env file with your GitHub Personal Access Token:");
  console.error("GITHUB_TOKEN=your_actual_token_here");
  console.error("Get your token from: https://github.com/settings/tokens");
  console.error("Required scopes: repo (for private repos) or public_repo (for public repos only)");
}

// Validate GitHub OAuth credentials
if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  console.error("❌ GitHub OAuth credentials not set!");
  console.error("Please add to your .env file:");
  console.error("GITHUB_CLIENT_ID=your_client_id");
  console.error("GITHUB_CLIENT_SECRET=your_client_secret");
  console.error("Get these from: https://github.com/settings/applications/new");
}

/**
 * Analyze assignee activity over the last 30 days
 * Categorizes assignees based on their work activity:
 * - inactive: No work done in 30 days
 * - dormant: Very little work (at risk of becoming inactive)
 * - at-risk: Some work but not enough (between dormant and active)
 * - active: Frequent and consistent work activity
 */
const analyzeAssigneeActivity = async (assignee, owner, repo, issue) => {
  if (!assignee) return null;

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    // Fetch assignee's recent commits in this repository
    let commits = [];
    try {
      const commitsResponse = await axios.get(
        `https://api.github.com/search/commits?q=author:${assignee.login}+repo:${owner}/${repo}+committer-date:>${thirtyDaysAgo.toISOString().split('T')[0]}`,
        { 
          headers: { Authorization: `token ${token}` },
          timeout: 5000
        }
      );
      commits = commitsResponse.data.items || [];
    } catch (error) {
      // Silently handle rate limit errors - don't log every 403
      if (error.response?.status !== 403) {
        console.error(`Error fetching commits for ${assignee.login}:`, error.message);
      }
    }

    // Fetch assignee's recent pull requests
    let pullRequests = [];
    try {
      const prsResponse = await axios.get(
        `https://api.github.com/search/issues?q=author:${assignee.login}+repo:${owner}/${repo}+type:pr+updated:>${thirtyDaysAgo.toISOString().split('T')[0]}`,
        { 
          headers: { Authorization: `token ${token}` },
          timeout: 5000
        }
      );
      pullRequests = prsResponse.data.items || [];
    } catch (error) {
      // Silently handle rate limit errors - don't log every 403
      if (error.response?.status !== 403) {
        console.error(`Error fetching PRs for ${assignee.login}:`, error.message);
      }
    }

    // Fetch assignee's recent issues
    let assignedIssues = [];
    try {
      const issuesResponse = await axios.get(
        `https://api.github.com/search/issues?q=assignee:${assignee.login}+repo:${owner}/${repo}+updated:>${thirtyDaysAgo.toISOString().split('T')[0]}`,
        { 
          headers: { Authorization: `token ${token}` },
          timeout: 5000
        }
      );
      assignedIssues = issuesResponse.data.items || [];
    } catch (error) {
      // Silently handle rate limit errors - don't log every 403
      if (error.response?.status !== 403) {
        console.error(`Error fetching assigned issues for ${assignee.login}:`, error.message);
      }
    }

    // Fetch comments and events for this specific issue
    let issueComments = [];
    let issueEvents = [];
    
    try {
      const commentsResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/issues/${issue.number}/comments`,
        { headers: { Authorization: `token ${token}` } }
      );
      issueComments = commentsResponse.data || [];

      const eventsResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/issues/${issue.number}/timeline`,
        { headers: { Authorization: `token ${token}` } }
      );
      issueEvents = eventsResponse.data || [];
    } catch (error) {
      console.error(`Error fetching issue activity for ${assignee.login}:`, error.message);
    }

    // Filter activity by assignee
    const assigneeComments = issueComments.filter(comment => 
      comment.user.login === assignee.login
    );
    const assigneeEvents = issueEvents.filter(event => 
      event.actor && event.actor.login === assignee.login
    );

    // Calculate activity scores
    const recentCommits = commits.filter(commit => 
      new Date(commit.commit.committer.date) > sevenDaysAgo
    );
    const recentPRs = pullRequests.filter(pr => 
      new Date(pr.updated_at) > sevenDaysAgo
    );
    const recentIssues = assignedIssues.filter(issue => 
      new Date(issue.updated_at) > sevenDaysAgo
    );
    const recentComments = assigneeComments.filter(comment => 
      new Date(comment.updated_at) > sevenDaysAgo
    );
    const recentEvents = assigneeEvents.filter(event => 
      new Date(event.created_at) > sevenDaysAgo
    );

    // Filter activities for 30-day period
    const commits30d = commits.filter(commit => 
      new Date(commit.commit.committer.date) > thirtyDaysAgo
    );
    const prs30d = pullRequests.filter(pr => 
      new Date(pr.updated_at) > thirtyDaysAgo
    );
    const issues30d = assignedIssues.filter(issue => 
      new Date(issue.updated_at) > thirtyDaysAgo
    );
    const comments30d = assigneeComments.filter(comment => 
      new Date(comment.updated_at) > thirtyDaysAgo
    );
    const events30d = assigneeEvents.filter(event => 
      new Date(event.created_at) > thirtyDaysAgo
    );

    // Calculate activity scores (weighted)
    const recentActivityScore = (recentCommits.length * 3) + (recentPRs.length * 2) + 
                               recentIssues.length + (recentComments.length * 2) + recentEvents.length;
    
    const totalActivityScore = (commits30d.length * 3) + (prs30d.length * 2) + 
                              issues30d.length + (comments30d.length * 2) + events30d.length;

    // Calculate days since assignment
    const daysSinceAssignment = Math.floor((now - new Date(issue.updated_at)) / (1000 * 60 * 60 * 24));

    // Categorize assignee based on activity
    let status;
    let activityLevel;

    // If we couldn't fetch detailed activity data due to API limits, 
    // check if we have any data at all to determine if it's an API issue or truly no activity
    if (commits.length === 0 && pullRequests.length === 0 && assignedIssues.length === 0 && 
        issueComments.length === 0 && issueEvents.length === 0) {
      // No activity data available at all - likely API limits, assume dormant for safety
      status = 'dormant';
      activityLevel = 'Activity monitoring unavailable - assumed dormant';
    } else if (totalActivityScore === 0) {
      // No activity in 30 days - check if we have older activity data
      if (commits.length > 0 || pullRequests.length > 0 || assignedIssues.length > 0 || 
          issueComments.length > 0 || issueEvents.length > 0) {
        // Has activity but not in last 30 days
        status = 'inactive';
        activityLevel = 'No activity in last 30 days';
      } else {
        // No activity data at all
        status = 'inactive';
        activityLevel = 'No activity detected';
      }
    } else if (totalActivityScore <= 2) {
      // Very little activity
      status = 'dormant';
      activityLevel = 'Very minimal activity';
    } else if (totalActivityScore <= 5) {
      // Some activity but not much
      status = 'at-risk';
      activityLevel = 'Low activity - at risk of becoming inactive';
    } else if (recentActivityScore >= 3) {
      // Good recent activity
      status = 'active';
      activityLevel = 'Frequent and consistent activity';
    } else if (totalActivityScore >= 6) {
      // Decent total activity but not recent
      status = 'at-risk';
      activityLevel = 'Some activity but not recent';
    } else {
      // Fallback - minimal activity
      status = 'dormant';
      activityLevel = 'Minimal activity detected';
    }

    // Adjust for very recent assignments (give them time)
    if (daysSinceAssignment < 3) {
      if (status === 'inactive') {
        status = 'dormant';
        activityLevel = 'Recently assigned - monitoring activity';
      }
    }

    return {
      login: assignee.login,
      status: status,
      activityLevel: activityLevel,
      daysSinceAssignment: daysSinceAssignment,
      activity: {
        last_7_days: {
          commits: recentCommits.length,
          prs: recentPRs.length,
          issues: recentIssues.length,
          comments: recentComments.length,
          events: recentEvents.length,
          score: recentActivityScore
        },
        last_30_days: {
          commits: commits30d.length,
          prs: prs30d.length,
          issues: issues30d.length,
          comments: comments30d.length,
          events: events30d.length,
          score: totalActivityScore
        }
      }
    };
  } catch (error) {
    console.error(`Error analyzing assignee ${assignee.login}:`, error.message);
    return {
      login: assignee.login,
      status: 'error',
      activityLevel: 'Error analyzing activity',
      activity: null,
      error: error.message
    };
  }
};

/**
 * Categorize issue based on assignee activity
 */
const categorizeIssue = (issue, assigneeActivity) => {
  if (!issue.assignee) {
    return 'unassigned';
  }

  if (!assigneeActivity || assigneeActivity.status === 'error') {
    return 'error';
  }

  return assigneeActivity.status;
};

/**
 * GET /api/issues/:owner/:repo
 * Fetches issues and categorizes them based on assignee activity
 */
app.get("/api/issues/:owner/:repo", async (req, res) => {
  const { owner, repo } = req.params;
  const { page = 1, per_page = 30 } = req.query;
  const issuesUrl = `https://api.github.com/repos/${owner}/${repo}/issues`;

  console.log(`🔍 Fetching issues for ${owner}/${repo} (page ${page}, ${per_page} per page)...`);
  
  try {
    // Fetch the requested page with 30 issues per page
    const issuesPerPage = 30;
    const response = await axios.get(issuesUrl, {
      headers: { Authorization: `token ${token}` },
      params: {
        page: parseInt(page),
        per_page: issuesPerPage,
        state: 'open'
      }
    });
    const issues = response.data;
    
    // Get pagination info from Link header
    const linkHeader = response.headers.link;
    let totalIssues = 0;
    let totalPages = 1;
    let hasNextPage = false;
    let hasPrevPage = false;
    
    if (linkHeader) {
      // Check for next and previous pages
      hasNextPage = linkHeader.includes('rel="next"');
      hasPrevPage = linkHeader.includes('rel="prev"');
      
      // For cursor-based pagination, we can't get exact total count
      // But we can estimate based on current page and whether there's a next page
      if (linkHeader.includes('after=')) {
        // Cursor-based pagination
        if (hasNextPage) {
          // Estimate: if there's a next page, assume at least current page + 1
          totalPages = parseInt(page) + 1;
          totalIssues = totalPages * issuesPerPage;
        } else {
          // This is the last page
          totalPages = parseInt(page);
          totalIssues = (parseInt(page) - 1) * issuesPerPage + issues.length;
        }
      } else {
        // Traditional page-based pagination
        const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
        if (lastPageMatch) {
          const lastPage = parseInt(lastPageMatch[1]);
          totalPages = lastPage;
          // Get actual count from last page
          const lastPageResponse = await axios.get(issuesUrl, {
            headers: { Authorization: `token ${token}` },
            params: {
              page: lastPage,
              per_page: issuesPerPage,
              state: 'open'
            }
          });
          totalIssues = (lastPage - 1) * issuesPerPage + lastPageResponse.data.length;
        } else {
          totalIssues = issues.length;
          totalPages = 1;
        }
      }
    } else {
      totalIssues = issues.length;
      totalPages = 1;
    }

    console.log(`Processing ${issues.length} issues...`);
    const categorizedIssues = await Promise.all(
      issues.map(async (issue) => {
        try {
          const assigneeActivity = issue.assignee 
            ? await analyzeAssigneeActivity(issue.assignee, owner, repo, issue)
            : null;
          
          const category = categorizeIssue(issue, assigneeActivity);

          return {
            issue_number: issue.number,
            title: issue.title,
            claimed_by: issue.assignee ? issue.assignee.login : null,
            assigned_at: issue.assignee ? issue.updated_at : null,
            last_activity: issue.updated_at,
            has_pull_request: !!issue.pull_request,
            category: category,
            url: issue.html_url,
            state: issue.state,
            assignee_activity: assigneeActivity
          };
        } catch (error) {
          console.error(`Error processing issue ${issue.number}:`, error.message);
          return {
            issue_number: issue.number,
            title: issue.title,
            claimed_by: issue.assignee ? issue.assignee.login : null,
            assigned_at: issue.assignee ? issue.updated_at : null,
            last_activity: issue.updated_at,
            has_pull_request: !!issue.pull_request,
            category: 'error',
            url: issue.html_url,
            state: issue.state,
            assignee_activity: null
          };
        }
      })
    );

    // Group issues by category
    const categorized = {
      active: categorizedIssues.filter(issue => issue.category === 'active'),
      'at-risk': categorizedIssues.filter(issue => issue.category === 'at-risk'),
      dormant: categorizedIssues.filter(issue => issue.category === 'dormant'),
      inactive: categorizedIssues.filter(issue => issue.category === 'inactive'),
      unassigned: categorizedIssues.filter(issue => issue.category === 'unassigned'),
      error: categorizedIssues.filter(issue => issue.category === 'error')
    };

    // Create assignee summary
    const assigneeSummary = {};
    categorizedIssues.forEach(issue => {
      if (issue.assignee_activity) {
        const status = issue.assignee_activity.status;
        if (!assigneeSummary[status]) {
          assigneeSummary[status] = 0;
        }
        assigneeSummary[status]++;
      }
    });

    // Use the pagination info we already calculated

    res.json({
      repo: `${owner}/${repo}`,
      pagination: {
        current_page: parseInt(page),
        per_page: issuesPerPage,
        total_pages: totalPages,
        total_issues: totalIssues,
        has_next_page: hasNextPage,
        has_prev_page: hasPrevPage
      },
      total: categorizedIssues.length,
      categories: {
        active: categorized.active.length,
        'at-risk': categorized['at-risk'].length,
        dormant: categorized.dormant.length,
        inactive: categorized.inactive.length,
        unassigned: categorized.unassigned.length,
        error: categorized.error.length
      },
      assignee_summary: {
        active: assigneeSummary.active || 0,
        'at-risk': assigneeSummary['at-risk'] || 0,
        dormant: assigneeSummary.dormant || 0,
        inactive: assigneeSummary.inactive || 0,
        error: assigneeSummary.error || 0
      },
      issues: categorizedIssues,
      categorized: categorized
    });
  } catch (error) {
    console.error("Error fetching issues:", error.message);
    res.status(500).json({ error: "Failed to fetch issues" });
  }
});

/**
 * GET /api/issues/:owner/:repo/all
 * Fetches ALL issues from all pages and categorizes them based on assignee activity
 */
app.get("/api/issues/:owner/:repo/all", async (req, res) => {
  const { owner, repo } = req.params;
  const { per_page = 100 } = req.query; // Default to 100 per page for efficiency
  const issuesUrl = `https://api.github.com/repos/${owner}/${repo}/issues`;

  console.log(`🔍 Fetching ALL issues for ${owner}/${repo}...`);
  
  try {
    let allIssues = [];
    let currentPage = 1;
    let hasMorePages = true;
    let totalPages = 1;

    // Fetch all pages
    while (hasMorePages) {
      console.log(`📄 Fetching page ${currentPage}...`);
      
      const response = await axios.get(issuesUrl, {
        headers: { Authorization: `token ${token}` },
        params: {
          page: currentPage,
          per_page: parseInt(per_page),
          state: 'open'
        }
      });

      const issues = response.data;
      allIssues = allIssues.concat(issues);

      // Check if there are more pages
      const linkHeader = response.headers.link;
      if (linkHeader && linkHeader.includes('rel="next"')) {
        currentPage++;
        // Extract total pages from the last page link
        const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
        if (lastPageMatch) {
          totalPages = parseInt(lastPageMatch[1]);
        }
      } else {
        hasMorePages = false;
        if (linkHeader) {
          const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
          if (lastPageMatch) {
            totalPages = parseInt(lastPageMatch[1]);
          }
        }
      }

      // Safety limit to prevent infinite loops
      if (currentPage > 50) {
        console.log("⚠️ Reached safety limit of 50 pages");
        break;
      }
    }

    console.log(`📊 Total issues fetched: ${allIssues.length} from ${totalPages} pages`);

    // Process all issues
    console.log(`Processing ${allIssues.length} issues...`);
    const categorizedIssues = await Promise.all(
      allIssues.map(async (issue) => {
        try {
          const assigneeActivity = issue.assignee 
            ? await analyzeAssigneeActivity(issue.assignee, owner, repo, issue)
            : null;
          
          const category = categorizeIssue(issue, assigneeActivity);

          return {
            issue_number: issue.number,
            title: issue.title,
            claimed_by: issue.assignee ? issue.assignee.login : null,
            assigned_at: issue.assignee ? issue.updated_at : null,
            last_activity: issue.updated_at,
            has_pull_request: !!issue.pull_request,
            category: category,
            url: issue.html_url,
            state: issue.state,
            assignee_activity: assigneeActivity
          };
        } catch (error) {
          console.error(`Error processing issue ${issue.number}:`, error.message);
          return {
            issue_number: issue.number,
            title: issue.title,
            claimed_by: issue.assignee ? issue.assignee.login : null,
            assigned_at: issue.assignee ? issue.updated_at : null,
            last_activity: issue.updated_at,
            has_pull_request: !!issue.pull_request,
            category: 'error',
            url: issue.html_url,
            state: issue.state,
            assignee_activity: null
          };
        }
      })
    );

    // Group issues by category
    const categorized = {
      active: categorizedIssues.filter(issue => issue.category === 'active'),
      'at-risk': categorizedIssues.filter(issue => issue.category === 'at-risk'),
      dormant: categorizedIssues.filter(issue => issue.category === 'dormant'),
      inactive: categorizedIssues.filter(issue => issue.category === 'inactive'),
      unassigned: categorizedIssues.filter(issue => issue.category === 'unassigned'),
      error: categorizedIssues.filter(issue => issue.category === 'error')
    };

    // Create assignee summary
    const assigneeSummary = {};
    categorizedIssues.forEach(issue => {
      if (issue.assignee_activity) {
        const status = issue.assignee_activity.status;
        if (!assigneeSummary[status]) {
          assigneeSummary[status] = 0;
        }
        assigneeSummary[status]++;
      }
    });

    res.json({
      repo: `${owner}/${repo}`,
      pagination: {
        total_pages: totalPages,
        per_page: parseInt(per_page),
        total_issues: allIssues.length
      },
      total: categorizedIssues.length,
      categories: {
        active: categorized.active.length,
        'at-risk': categorized['at-risk'].length,
        dormant: categorized.dormant.length,
        inactive: categorized.inactive.length,
        unassigned: categorized.unassigned.length,
        error: categorized.error.length
      },
      assignee_summary: {
        active: assigneeSummary.active || 0,
        'at-risk': assigneeSummary['at-risk'] || 0,
        dormant: assigneeSummary.dormant || 0,
        inactive: assigneeSummary.inactive || 0,
        error: assigneeSummary.error || 0
      },
      issues: categorizedIssues,
      categorized: categorized
    });
  } catch (error) {
    console.error("Error fetching all issues:", error.message);
    res.status(500).json({ error: "Failed to fetch all issues" });
  }
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  console.log(`🔍 Activity tracking system ready`);
});