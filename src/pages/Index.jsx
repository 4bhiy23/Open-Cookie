import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SummaryCard } from "@/components/SummaryCard";
import { IssueCard } from "@/components/IssueCard";
import { ActivityFeed } from "@/components/ActivityFeed";
import { FolderOpen, Activity, Clock, AlertTriangle, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Default repository for demo
const DEFAULT_OWNER = "facebook";
const DEFAULT_REPO = "react";

// Function to fetch issues from API
const fetchIssues = async (owner, repo, page = 1, fetchAll = false) => {
  const endpoint = fetchAll 
    ? `http://localhost:3000/api/issues/${owner}/${repo}/all`
    : `http://localhost:3000/api/issues/${owner}/${repo}?page=${page}`;
  
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error('Failed to fetch issues');
  }
  return response.json();
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [owner, setOwner] = useState(DEFAULT_OWNER);
  const [repo, setRepo] = useState(DEFAULT_REPO);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchAll, setFetchAll] = useState(false);

  // Fetch issues from API
  const { data: issuesData, isLoading, error } = useQuery({
    queryKey: ['issues', owner, repo, currentPage, fetchAll],
    queryFn: () => fetchIssues(owner, repo, currentPage, fetchAll),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const issues = issuesData?.categorized || {
    active: [],
    'at-risk': [],
    dormant: [],
    inactive: [],
    unassigned: [],
    error: []
  };

  const totalIssues = issuesData?.total || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-3 py-3">
          <div className="flex items-center gap-3">
            {/* <span className="text-4xl">🍪</span> */}
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {/* Open-Cookie */}
                <img src="./public/logo.png" alt="" className="w-7/12 cursor-pointer"/>
              </h1>
              {/* <p className="text-sm text-muted-foreground">
                Open Source Issue Health Monitor
              </p> */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Repository Input */}
        <div className="mb-6 p-4 bg-card rounded-lg border">
          <div className="flex gap-4 items-end mb-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Repository Owner</label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g., facebook"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Repository Name</label>
              <input
                type="text"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g., react"
              />
            </div>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex gap-4 items-center justify-between">
            <div className="flex gap-2 items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={fetchAll}
                  onChange={(e) => {
                    setFetchAll(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded"
                />
                <span className="text-sm font-medium">Fetch All Pages</span>
              </label>
            </div>
            
            {!fetchAll && issuesData?.pagination && (
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={!issuesData.pagination.has_prev_page}
                  className="px-3 py-1 text-sm border border-input rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
                >
                  Previous
                </button>
                <span className="text-sm text-muted-foreground">
                  Page {issuesData.pagination.current_page} 
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!issuesData.pagination.has_next_page}
                  className="px-3 py-1 text-sm border border-input rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
                >
                  Next
                </button>
              </div>
            )}
            
            {fetchAll && issuesData?.pagination && (
              <div className="text-sm text-muted-foreground">
                Fetched {issuesData.pagination.total_issues} issues from {issuesData.pagination.total_pages} pages
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <SummaryCard
            title="Total Issues"
            value={totalIssues}
            status="neutral"
            icon={FolderOpen}
          />
          <SummaryCard
            title="Active"
            value={issues.active.length}
            status="active"
            icon={Activity}
          />
          <SummaryCard
            title="At Risk"
            value={issues['at-risk'].length}
            status="at-risk"
            icon={AlertCircle}
          />
          <SummaryCard
            title="Dormant"
            value={issues.dormant.length}
            status="dormant"
            icon={Clock}
          />
          <SummaryCard
            title="Inactive"
            value={issues.inactive.length}
            status="inactive"
            icon={AlertTriangle}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Issues Section */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="at-risk">At Risk</TabsTrigger>
                <TabsTrigger value="dormant">Dormant</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
              </TabsList>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading issues...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">Error loading issues: {error.message}</p>
                </div>
              ) : (
                <>
                  <TabsContent value="active" className="space-y-4">
                    {issues.active.map((issue) => (
                      <IssueCard 
                        key={issue.issue_number} 
                        title={issue.title}
                        issueNumber={issue.issue_number}
                        claimedBy={issue.claimed_by}
                        lastActivity={new Date(issue.last_activity).toLocaleDateString()}
                        status={issue.category}
                        url={issue.url}
                        assigneeActivity={issue.assignee_activity}
                      />
                    ))}
                    {issues.active.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No active issues</p>
                    )}
                  </TabsContent>

                  <TabsContent value="at-risk" className="space-y-4">
                    {issues['at-risk'].map((issue) => (
                      <IssueCard 
                        key={issue.issue_number} 
                        title={issue.title}
                        issueNumber={issue.issue_number}
                        claimedBy={issue.claimed_by}
                        lastActivity={new Date(issue.last_activity).toLocaleDateString()}
                        status={issue.category}
                        url={issue.url}
                        assigneeActivity={issue.assignee_activity}
                      />
                    ))}
                    {issues['at-risk'].length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No at-risk issues</p>
                    )}
                  </TabsContent>

                  <TabsContent value="dormant" className="space-y-4">
                    {issues.dormant.map((issue) => (
                      <IssueCard 
                        key={issue.issue_number} 
                        title={issue.title}
                        issueNumber={issue.issue_number}
                        claimedBy={issue.claimed_by}
                        lastActivity={new Date(issue.last_activity).toLocaleDateString()}
                        status={issue.category}
                        url={issue.url}
                        assigneeActivity={issue.assignee_activity}
                      />
                    ))}
                    {issues.dormant.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No dormant issues</p>
                    )}
                  </TabsContent>

                  <TabsContent value="inactive" className="space-y-4">
                    {issues.inactive.map((issue) => (
                      <IssueCard 
                        key={issue.issue_number} 
                        title={issue.title}
                        issueNumber={issue.issue_number}
                        claimedBy={issue.claimed_by}
                        lastActivity={new Date(issue.last_activity).toLocaleDateString()}
                        status={issue.category}
                        url={issue.url}
                        assigneeActivity={issue.assignee_activity}
                      />
                    ))}
                    {issues.inactive.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No inactive issues</p>
                    )}
                  </TabsContent>

                  <TabsContent value="unassigned" className="space-y-4">
                    {issues.unassigned.map((issue) => (
                      <IssueCard 
                        key={issue.issue_number} 
                        title={issue.title}
                        issueNumber={issue.issue_number}
                        claimedBy={issue.claimed_by}
                        lastActivity={new Date(issue.last_activity).toLocaleDateString()}
                        status={issue.category}
                        url={issue.url}
                        assigneeActivity={issue.assignee_activity}
                      />
                    ))}
                    {issues.unassigned.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No unassigned issues</p>
                    )}
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
