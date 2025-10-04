import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Star, 
  GitFork, 
  AlertCircle, 
  Calendar,
  ExternalLink,
  LogOut,
  User
} from 'lucide-react';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRepos();
  }, []);

  useEffect(() => {
    // Filter repos based on search term
    const filtered = repos.filter(repo =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRepos(filtered);
  }, [repos, searchTerm]);

  const fetchRepos = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/user/repos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      const data = await response.json();
      setRepos(data.repos);
    } catch (error) {
      console.error('Error fetching repos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRepoClick = (repo) => {
    navigate(`/repo/${repo.full_name}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6e0bf] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5a1c1c]"></div>
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
              <img
                src="/logo.png"
                alt="Open-Cookie logo"
                className="h-10"
              />
              <h1 className="text-2xl font-bold text-[#5a1c1c]">Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar_url}
                  alt={user.name || user.login}
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-[#5a1c1c] font-medium">
                  {user.name || user.login}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-[#5a1c1c] text-[#5a1c1c] hover:bg-[#5a1c1c10]"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold text-[#5a1c1c] mb-2">
            Welcome back, {user.name || user.login}! 👋
          </h2>
          <p className="text-lg text-[#5a1c1c99]">
            Manage and analyze your GitHub repositories
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5a1c1c99] h-4 w-4" />
            <Input
              type="text"
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-[#5a1c1c20] focus:border-[#5a1c1c]"
            />
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/70 backdrop-blur-sm border-[#5a1c1c20]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#5a1c1c99]">Total Repositories</p>
                  <p className="text-2xl font-bold text-[#5a1c1c]">{repos.length}</p>
                </div>
                <User className="h-8 w-8 text-[#5a1c1c99]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-[#5a1c1c20]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#5a1c1c99]">Public Repos</p>
                  <p className="text-2xl font-bold text-[#5a1c1c]">
                    {repos.filter(repo => !repo.private).length}
                  </p>
                </div>
                <ExternalLink className="h-8 w-8 text-[#5a1c1c99]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-[#5a1c1c20]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#5a1c1c99]">Private Repos</p>
                  <p className="text-2xl font-bold text-[#5a1c1c]">
                    {repos.filter(repo => repo.private).length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-[#5a1c1c99]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-[#5a1c1c20]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#5a1c1c99]">Total Stars</p>
                  <p className="text-2xl font-bold text-[#5a1c1c]">
                    {repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)}
                  </p>
                </div>
                <Star className="h-8 w-8 text-[#5a1c1c99]" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Repositories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-[#5a1c1c] mb-6">
            Your Repositories ({filteredRepos.length})
          </h3>

          {filteredRepos.length === 0 ? (
            <Card className="bg-white/70 backdrop-blur-sm border-[#5a1c1c20]">
              <CardContent className="p-12 text-center">
                <p className="text-[#5a1c1c99] text-lg">
                  {searchTerm ? 'No repositories match your search.' : 'No repositories found.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRepos.map((repo, index) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="bg-white/70 backdrop-blur-sm border-[#5a1c1c20] hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-white/80"
                    onClick={() => handleRepoClick(repo)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg text-[#5a1c1c] line-clamp-1">
                          {repo.name}
                        </CardTitle>
                        <Badge 
                          variant={repo.private ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {repo.private ? 'Private' : 'Public'}
                        </Badge>
                      </div>
                      {repo.description && (
                        <p className="text-sm text-[#5a1c1c99] line-clamp-2">
                          {repo.description}
                        </p>
                      )}
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-[#5a1c1c99] mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            <span>{repo.stargazers_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GitFork className="h-4 w-4" />
                            <span>{repo.forks_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>{repo.open_issues_count}</span>
                          </div>
                        </div>
                        {repo.language && (
                          <Badge variant="outline" className="text-xs">
                            {repo.language}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-[#5a1c1c99]">
                          <Calendar className="h-3 w-3" />
                          <span>Updated {formatDate(repo.updated_at)}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs border-[#5a1c1c] text-[#5a1c1c] hover:bg-[#5a1c1c10]"
                        >
                          View Issues
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
