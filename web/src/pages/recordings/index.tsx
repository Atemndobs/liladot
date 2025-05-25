import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Mic,
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Download,
  Trash2,
  Share2,
  FileText,
  Clock,
  Calendar,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Types
type RecordingStatus = 'processing' | 'completed' | 'failed';

interface Recording {
  id: string;
  title: string;
  duration: number; // in seconds
  date: string; // ISO date string
  status: RecordingStatus;
  size: number; // in bytes
  isStarred: boolean;
  transcript?: string;
}

// Mock data - in a real app, this would come from an API
const mockRecordings: Recording[] = [
  {
    id: '1',
    title: 'Team Standup Meeting',
    duration: 1245, // 20:45
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    status: 'completed',
    size: 25400000, // 25.4 MB
    isStarred: true,
    transcript: 'Team discussed the current sprint progress and blockers...',
  },
  {
    id: '2',
    title: 'Product Planning Session',
    duration: 2460, // 41:00
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    status: 'completed',
    size: 48700000, // 48.7 MB
    isStarred: false,
  },
  {
    id: '3',
    title: 'Customer Interview - John Doe',
    duration: 1860, // 31:00
    date: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(), // 1 week ago
    status: 'completed',
    size: 36500000, // 36.5 MB
    isStarred: true,
  },
  {
    id: '4',
    title: 'Marketing Strategy Q2',
    duration: 0, // Processing
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    status: 'processing',
    size: 0,
    isStarred: false,
  },
  {
    id: '5',
    title: 'Failed Recording',
    duration: 0,
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    status: 'failed',
    size: 0,
    isStarred: false,
  },
];

// Helper functions
const formatDuration = (seconds: number): string => {
  if (seconds === 0) return '--:--';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '--';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const statusVariantMap: Record<RecordingStatus, 'default' | 'secondary' | 'destructive'> = {
  completed: 'default',
  processing: 'secondary',
  failed: 'destructive',
};

export function RecordingsPage() {
  const { toast } = useToast();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Recording;
    direction: 'asc' | 'desc';
  }>({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch recordings (in a real app, this would be an API call)
  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        setRecordings([...mockRecordings]);
      } catch (error) {
        console.error('Error fetching recordings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load recordings. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecordings();
  }, [toast]);

  // Handle sorting
  const requestSort = (key: keyof Recording) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting and filtering
  const filteredAndSortedRecordings = [...recordings]
    .filter((recording) =>
      recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (recording.transcript?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    )
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      // Handle undefined values
      if (aValue === undefined || bValue === undefined) return 0;

      // Convert to string for comparison to handle different types
      const aStr = String(aValue);
      const bStr = String(bValue);

      if (aStr < bStr) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aStr > bStr) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedRecordings.length / rowsPerPage);
  const paginatedRecordings = filteredAndSortedRecordings.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Select all/none
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedRecordings.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Toggle selection for a single row
  const toggleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  // Handle actions
  const handleDelete = (id: string) => {
    // In a real app, this would be an API call
    toast({
      title: 'Recording deleted',
      description: 'The recording has been moved to trash.',
    });
    setRecordings(recordings.filter((r) => r.id !== id));
    setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
  };

  const handleDownload = (id: string) => {
    // In a real app, this would trigger a download
    console.log('Downloading recording:', id);
    toast({
      title: 'Download started',
      description: 'Your recording is being prepared for download.',
    });
  };

  const handleShare = (id: string) => {
    // In a real app, this would open a share dialog
    console.log('Sharing recording:', id);
    toast({
      title: 'Share recording',
      description: 'Share link copied to clipboard!',
    });
  };

  // Render status badge
  const renderStatusBadge = (status: RecordingStatus) => {
    const statusLabels = {
      completed: 'Completed',
      processing: 'Processing',
      failed: 'Failed',
    };

    return (
      <Badge variant={statusVariantMap[status]} className="capitalize">
        {statusLabels[status]}
      </Badge>
    );
  };

  // Render sort indicator
  const renderSortIndicator = (key: keyof Recording) => {
    if (sortConfig.key !== key) return null;
    return (
      <span className="ml-1">
        {sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  // Handle page navigation
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recordings</h1>
          <p className="text-muted-foreground">
            View and manage all your recorded meetings
          </p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Mic className="mr-2 h-4 w-4" />
            New Recording
          </Button>
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search recordings..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>Completed</DropdownMenuItem>
              <DropdownMenuItem>Processing</DropdownMenuItem>
              <DropdownMenuItem>Failed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Date
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Sort by date</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Newest first</DropdownMenuItem>
              <DropdownMenuItem>Oldest first</DropdownMenuItem>
              <DropdownMenuItem>Last modified</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Recordings table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  id="select-all"
                  checked={
                    paginatedRecordings.length > 0 &&
                    selectedIds.length === paginatedRecordings.length
                  }
                  onCheckedChange={(checked: boolean) =>
                    toggleSelectAll(checked)
                  }
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="min-w-[200px]">
                <button
                  className="flex items-center"
                  onClick={() => requestSort('title')}
                >
                  Title
                  {renderSortIndicator('title')}
                </button>
              </TableHead>
              <TableHead className="w-[140px]">
                <button
                  className="flex items-center"
                  onClick={() => requestSort('status')}
                >
                  Status
                  {renderSortIndicator('status')}
                </button>
              </TableHead>
              <TableHead className="w-[120px]">
                <button
                  className="flex items-center"
                  onClick={() => requestSort('duration')}
                >
                  Duration
                  {renderSortIndicator('duration')}
                </button>
              </TableHead>
              <TableHead className="w-[160px]">
                <button
                  className="flex items-center"
                  onClick={() => requestSort('date')}
                >
                  Date
                  {renderSortIndicator('date')}
                </button>
              </TableHead>
              <TableHead className="w-[120px]">
                <button
                  className="flex items-center"
                  onClick={() => requestSort('size')}
                >
                  Size
                  {renderSortIndicator('size')}
                </button>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
                    <span>Loading recordings...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedRecordings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {searchQuery
                        ? 'No recordings match your search.'
                        : 'No recordings found.'}
                    </p>
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchQuery('')}
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedRecordings.map((recording) => (
                <TableRow key={recording.id}>
                  <TableCell>
                    <Checkbox
                      id={`select-${recording.id}`}
                      checked={selectedIds.includes(recording.id)}
                      onCheckedChange={(checked: boolean) =>
                        toggleSelect(recording.id, checked)
                      }
                      aria-label={`Select ${recording.title}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link
                      to={`/recordings/${recording.id}`}
                      className="hover:underline"
                    >
                      {recording.title}
                    </Link>
                  </TableCell>
                  <TableCell>{renderStatusBadge(recording.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                      <span>{formatDuration(recording.duration)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                      <span>
                        {format(new Date(recording.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatFileSize(recording.size)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleDownload(recording.id)}
                          disabled={recording.status !== 'completed'}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleShare(recording.id)}
                          disabled={recording.status !== 'completed'}
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(recording.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && paginatedRecordings.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {selectedIds.length > 0 ? (
              <p>{selectedIds.length} of {filteredAndSortedRecordings.length} row(s) selected</p>
            ) : (
              <p>
                Showing {Math.min(
                  (currentPage - 1) * rowsPerPage + 1,
                  filteredAndSortedRecordings.length
                )}
                -{Math.min(currentPage * rowsPerPage, filteredAndSortedRecordings.length)} of{' '}
                {filteredAndSortedRecordings.length} recordings
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <select
                aria-label="Rows per page"
                className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm"
                value={rowsPerPage}
                onChange={() => {
                  setCurrentPage(1);
                  // In a real app, you would update the rows per page state here
                }}
              >
                {[5, 10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className={buttonVariants({ variant: 'outline', className: 'h-8 w-8 p-0' })}
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                className={buttonVariants({ variant: 'outline', className: 'h-8 w-8 p-0' })}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <button
                className={buttonVariants({ variant: 'outline', className: 'h-8 w-8 p-0' })}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                className={buttonVariants({ variant: 'outline', className: 'h-8 w-8 p-0' })}
                onClick={() => goToPage(totalPages)}
                disabled={currentPage >= totalPages}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecordingsPage;
