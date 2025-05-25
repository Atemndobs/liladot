import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mic, Plus, Clock, Headphones, FileText, Upload, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { formatDate } from '@/lib/utils';

type Recording = {
  id: string;
  title: string;
  duration: number;
  date: string;
  status: 'processing' | 'completed' | 'failed';
  transcript?: string;
};

type UsageStats = {
  totalRecordings: number;
  totalDuration: number;
  storageUsed: number;
  storageLimit: number;
};

export function DashboardPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [recentRecordings, setRecentRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usageStats, setUsageStats] = useState<UsageStats>({
    totalRecordings: 0,
    totalDuration: 0,
    storageUsed: 0,
    storageLimit: 1000000000, // 1GB default limit
  });

  // Fetch recent recordings and usage stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call to fetch recordings
        // In a real app, this would be an actual API call
        const mockRecordings: Recording[] = [
          {
            id: '1',
            title: 'Team Standup Meeting',
            duration: 1245, // in seconds
            date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            status: 'completed',
            transcript: 'Team discussed the current sprint progress and blockers...',
          },
          {
            id: '2',
            title: 'Product Planning',
            duration: 2460, // 41 minutes
            date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
            status: 'completed',
          },
          {
            id: '3',
            title: 'Customer Interview',
            duration: 1860, // 31 minutes
            date: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(), // 1 week ago
            status: 'completed',
          },
        ];

        const mockUsageStats: UsageStats = {
          totalRecordings: 12,
          totalDuration: 12400, // in minutes
          storageUsed: 256000000, // 256MB
          storageLimit: 1000000000, // 1GB
        };

        setRecentRecordings(mockRecordings);
        setUsageStats(mockUsageStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const storagePercentage = Math.min(
    Math.round((usageStats.storageUsed / usageStats.storageLimit) * 100),
    100
  );

  const quickActions = [
    {
      title: 'New Recording',
      description: 'Start a new meeting recording',
      icon: <Mic className="h-6 w-6 text-indigo-600" />,
      action: () => {
        // In a real app, this would open the recording interface
        toast({
          title: 'Start Recording',
          description: 'Opening recording interface...',
        });
      },
    },
    {
      title: 'Upload Recording',
      description: 'Upload an existing recording',
      icon: <Upload className="h-6 w-6 text-indigo-600" />,
      action: () => {
        // In a real app, this would open the file upload dialog
        toast({
          title: 'Upload Recording',
          description: 'Opening file upload dialog...',
        });
      },
    },
    {
      title: 'Settings',
      description: 'Configure your account settings',
      icon: <Settings className="h-6 w-6 text-indigo-600" />,
      action: () => {
        // In a real app, this would navigate to settings
        window.location.href = '/settings';
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.email?.split('@')[0] || 'User'}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your recordings
          </p>
        </div>
        <div className="flex space-x-2
">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Recording
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent" disabled={isLoading}>
            Recent Recordings
          </TabsTrigger>
          <TabsTrigger value="analytics" disabled>
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Recordings
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {usageStats.totalRecordings}
                </div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Duration
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(usageStats.totalDuration / 60)}h{' '}
                  {usageStats.totalDuration % 60}m
                </div>
                <p className="text-xs text-muted-foreground">
                  +10% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Storage Used
                </CardTitle>
                <Headphones className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(usageStats.storageUsed / 1000000).toFixed(1)} MB
                </div>
                <p className="text-xs text-muted-foreground">
                  {storagePercentage}% of {usageStats.storageLimit / 1000000}MB used
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Plan
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Free</div>
                <p className="text-xs text-muted-foreground">
                  <button className="text-indigo-600 hover:underline">
                    Upgrade to Pro
                  </button>
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Quickly access common actions to manage your recordings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="flex flex-col items-center justify-center rounded-lg border p-6 text-center transition-colors hover:bg-accent/50"
                    >
                      <div className="mb-2 rounded-full bg-indigo-50 p-3">
                        {action.icon}
                      </div>
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your most recent recordings and actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
                    </div>
                  ) : recentRecordings.length > 0 ? (
                    recentRecordings.map((recording) => (
                      <div
                        key={recording.id}
                        className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            <Link
                              to={`/recordings/${recording.id}`}
                              className="hover:underline"
                            >
                              {recording.title}
                            </Link>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(recording.date)}
                          </p>
                        </div>
                        <div className="text-sm font-medium">
                          {formatDuration(recording.duration)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      No recent recordings found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Recordings</CardTitle>
              <CardDescription>
                View and manage your recent recordings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
                </div>
              ) : recentRecordings.length > 0 ? (
                <div className="space-y-4">
                  {recentRecordings.map((recording) => (
                    <div
                      key={recording.id}
                      className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="rounded-lg bg-indigo-100 p-3 dark:bg-indigo-900/50">
                          <Mic className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            <Link
                              to={`/recordings/${recording.id}`}
                              className="hover:underline"
                            >
                              {recording.title}
                            </Link>
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(recording.date)} • {formatDuration(recording.duration)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/recordings/${recording.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
                  <div className="rounded-full bg-indigo-100 p-4 dark:bg-indigo-900/50">
                    <Mic className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-medium">No recordings yet</h3>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Get started by creating your first recording or uploading an existing
                    one.
                  </p>
                  <div className="flex space-x-2 pt-2">
                    <Button>
                      <Mic className="mr-2 h-4 w-4" />
                      New Recording
                    </Button>
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
