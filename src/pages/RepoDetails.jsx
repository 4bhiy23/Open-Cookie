import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Star, 
  GitFork, 
  AlertCircle, 
  Calendar,
  ExternalLink,
  User,
  Clock,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

const RepoDetails = () => {
  const { owner, repo } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchIssues();
  }, [owner, repo]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://10.7.23.153:3000'}/api/issues/${owner}/${repo}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'token': token
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch issues');
      }

      const data = await response.json();
      setIssues(data.issues || []);
    } catch (error) {
      console.error('Error fetching issues:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (category) => {
    switch (category) {
      case 'active':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'at-risk':
        return <TrendingDown className="h-4 w-4 text-yellow-600" />;
      case 'dormant':
        return <Minus className="h-4 w-4 text-orange-600" />;
      case 'inactive':
        return <Minus className="h-4 w-4 text-red-600" />;
      case 'unassigned':
        return <User className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (category) => {
    switch (category) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'dormant':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'unassigned':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const filteredIssues = issues.filter(issue => {
    if (activeTab === 'all') return true;
    return issue.category === activeTab;
  });

  const categoryCounts = {
    all: issues.length,
    active: issues.filter(i => i.category === 'active').length,
    'at-risk': issues.filter(i => i.category === 'at-risk').length,
    dormant: issues.filter(i => i.category === 'dormant').length,
    inactive: issues.filter(i => i.category === 'inactive').length,
    unassigned: issues.filter(i => i.category === 'unassigned').length,
    error: issues.filter(i => i.category === 'error').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6e0bf] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5a1c1c]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f6e0bf] flex items-center justify-center">
        <Card className="bg-white/70 backdrop-blur-sm border-[#5a1c1c20] max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#5a1c1c] mb-2">Error Loading Repository</h3>
            <p className="text-[#5a1c1c99] mb-4">{error}</p>
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-[#5a1c1c] hover:bg-[#7b2929] text-white"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6e0bf]">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-sm border-b border-[#5a1c1c20] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="border-[#5a1c1c] text-[#5a1c1c] hover:bg-[#5a1c1c10]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-[#5a1c1c]">
                  {owner}/{repo}
                </h1>
                <p className="text-[#5a1c1c99]">Repository Issues Analysis</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => window.open(`https://github.com/${owner}/${repo}`, '_blank')}
              className="border-[#5a1c1c] text-[#5a1c1c] hover:bg-[#5a1c1c10]"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on GitHub
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8"
        >
          {Object.entries(categoryCounts).map(([category, count]) => (
            <Card 
              key={category}
              className={`bg-white/70 backdrop-blur-sm border-[#5a1c1c20] cursor-pointer transition-all duration-200 hover:shadow-lg ${
                activeTab === category ? 'ring-2 ring-[#5a1c1c]' : ''
              }`}
              onClick={() => setActiveTab(category)}
            >
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  {getStatusIcon(category)}
                </div>
                <p className="text-2xl font-bold text-[#5a1c1c]">{count}</p>
                <p className="text-xs text-[#5a1c1c99] capitalize">
                  {category === 'at-risk' ? 'At Risk' : category}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Issues List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/70 backdrop-blur-sm border-[#5a1c1c20]">
            <CardHeader>
              <CardTitle className="text-xl text-[#5a1c1c]">
                Issues ({filteredIssues.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredIssues.length === 0 ? (
                <div className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-[#5a1c1c99] mx-auto mb-4" />
                  <p className="text-[#5a1c1c99]">
                    No issues found for the selected category.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#5a1c1c20]">
                  {filteredIssues.map((issue, index) => (
                    <motion.div
                      key={issue.issue_number}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 hover:bg-white/50 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-[#5a1c1c]">
                              #{issue.issue_number}
                            </h3>
                            <Badge className={getStatusColor(issue.category)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(issue.category)}
                                <span className="capitalize">
                                  {issue.category === 'at-risk' ? 'At Risk' : issue.category}
                                </span>
                              </div>
                            </Badge>
                            {issue.has_pull_request && (
                              <Badge variant="outline" className="text-xs">
                                Has PR
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-[#5a1c1c] mb-3 line-clamp-2">
                            {issue.title}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-[#5a1c1c99]">
                            {issue.claimed_by && (
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>Assigned to {issue.claimed_by}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>Updated {getRelativeTime(issue.last_activity)}</span>
                            </div>
                            {issue.assignee_activity && (
                              <div className="flex items-center gap-1">
                                <Activity className="h-4 w-4" />
                                <span>
                                  {issue.assignee_activity.activityLevel}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(issue.url, '_blank')}
                          className="border-[#5a1c1c] text-[#5a1c1c] hover:bg-[#5a1c1c10]"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {issue.assignee_activity && issue.assignee_activity.activity && (
                        <div className="mt-4 p-4 bg-[#f6e0bf]/50 rounded-lg">
                          <h4 className="text-sm font-semibold text-[#5a1c1c] mb-2">
                            Activity Summary
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-[#5a1c1c99]">Last 7 days:</p>
                              <p className="font-medium text-[#5a1c1c]">
                                {issue.assignee_activity.activity.last_7_days.commits} commits,{' '}
                                {issue.assignee_activity.activity.last_7_days.prs} PRs,{' '}
                                {issue.assignee_activity.activity.last_7_days.comments} comments
                              </p>
                            </div>
                            <div>
                              <p className="text-[#5a1c1c99]">Last 30 days:</p>
                              <p className="font-medium text-[#5a1c1c]">
                                {issue.assignee_activity.activity.last_30_days.commits} commits,{' '}
                                {issue.assignee_activity.activity.last_30_days.prs} PRs,{' '}
                                {issue.assignee_activity.activity.last_30_days.comments} comments
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default RepoDetails;
