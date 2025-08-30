import React, { useState, useEffect } from "react";
import { Search, Mic, ArrowUpDown, Download, UserPlus, MoreVertical, Edit3, Trash2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { fetchUsersData, UsersData, User, cancelUserSubscription } from '@/services/adminService';
import { toast } from 'sonner';

export default function UserManagement() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [usersData, setUsersData] = useState<UsersData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [cancellingUser, setCancellingUser] = useState<string | null>(null);

  useEffect(() => {
    const loadUsersData = async () => {
      try {
        const data = await fetchUsersData();
        setUsersData(data);
        setFilteredUsers(data.users);
      } catch (error) {
        console.error('Failed to load users data:', error);
        toast.error('Failed to load users data');
      } finally {
        setIsLoading(false);
      }
    };

    loadUsersData();
  }, []);

  useEffect(() => {
    if (usersData) {
      let filtered = usersData.users;
      
      // Search filter
      if (searchQuery) {
        filtered = filtered.filter(user =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setFilteredUsers(filtered);
    }
  }, [searchQuery, usersData, activeFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleCancelSubscription = async (userId: string, userName: string) => {
    try {
      setCancellingUser(userId);
      const response = await cancelUserSubscription(userId);
      
      if (response.success) {
        toast.success(`Subscription cancelled successfully for ${userName}`);
        // Refresh the users data
        const updatedData = await fetchUsersData();
        setUsersData(updatedData);
        setFilteredUsers(updatedData.users);
      } else {
        toast.error(response.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setCancellingUser(null);
    }
  };

  const totalUsers = usersData?.total_verified_users || 0;
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  if (isLoading) {
    return (
      <div className="flex-1 ml-10 p-8 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 ml-10 p-8 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold font-poppins text-gray-900">
                Users{" "}
                <span className="font-bold font-supply">
                  {totalUsers.toLocaleString()}
                </span>
              </h1>
            </div>
          </div>
          <div className="flex items-center justify-between">
            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#999999] h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 border-0 rounded-3xl w-72 bg-[#78788029] placeholder:text-[#999999] text-[#232323] focus:ring-0 focus:border-gray-300"
                />
                <Mic className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999999] h-4 w-4" />
              </div>
            </div>

            {/* Action Buttons */}
            {/* <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-white text-[#333333] border-[#909090] shadow-xl"
              >
                Subscription
              </Button>
              <Button
                variant="outline"
                className="bg-white text-[#333333] border-[#909090] shadow-xl"
              >
                Feedback
              </Button>
              <Button
                variant="outline"
                className="bg-white text-[#333333] border-[#909090] shadow-xl"
              >
                Issues Raised
              </Button>
            </div> */}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="border-b border-gray-500">
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-left font-medium text-gray-900">
                  <div className="flex items-center text-[18px] gap-2">
                    Name
                    <ArrowUpDown className="h-4 w-4 text-[#1E1E1E]" />
                  </div>
                  <div className="text-xs font-normal text-[#1E1E1E]">
                    Email ID
                  </div>
                </TableHead>
                <TableHead className="text-left font-medium text-gray-900">
                  <div className="flex text-[16px] items-center gap-2">
                    Signup Date
                    <ArrowUpDown className="h-4 w-4 text-gray-900" />
                  </div>
                </TableHead>
                <TableHead className="text-left font-medium text-gray-900">
                  <div className="flex text-[16px] items-center gap-2">
                    Last Login
                    <ArrowUpDown className="h-4 w-4 text-gray-900" />
                  </div>
                </TableHead>
                <TableHead className="text-left font-medium text-gray-900">
                  <div className="flex text-[16px] items-center gap-2">
                    Projects
                    <ArrowUpDown className="h-4 w-4 text-gray-900" />
                  </div>
                </TableHead>
                <TableHead className="text-right text-[16px] font-medium text-gray-900">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-500 py-8"
                  >
                    {searchQuery
                      ? "No users found matching your search."
                      : "No users found."}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-[18px] text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-900">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {formatDate(user.last_login_at)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-[14px] font-normal text-gray-900 px-3 py-1"
                      >
                        {user.no_of_projects} projects
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-black">
                      <Button
                        variant="link"
                        className="text-red-500"
                        disabled={cancellingUser === user.id}
                        onClick={() => handleCancelSubscription(user.id, user.name)}
                      >
                        {cancellingUser === user.id ? 'Cancelling...' : 'Cancel Subscription'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-sm text-black font-poppins">Showing</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(Number(value))}
            >
              <SelectTrigger className="w-16 bg-white text-[#1E1E1E] border border-gray-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white font-poppins text-[#1E1E1E]">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs whitespace-nowrap font-poppins font-medium text-black">
              Out of {filteredUsers.length} filtered (
              {totalUsers.toLocaleString()} total)
            </span>
          </div>

          <div className="ml-auto">
            <Pagination>
              <PaginationContent className="text-black flex gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                <PaginationItem>
                  <Select
                    value={currentPage.toString()}
                    onValueChange={(value) => setCurrentPage(Number(value))}
                  >
                    <SelectTrigger className="w-12 bg-white text-[#1E1E1E] border border-gray-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white font-poppins text-[#1E1E1E]">
                      {Array.from(
                        { length: Math.min(totalPages, 10) },
                        (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}