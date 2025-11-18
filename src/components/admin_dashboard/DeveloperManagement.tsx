import React, { useState, useEffect } from "react";
import { Search, Mic, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { fetchDevelopersData, DevelopersData, Developer } from "@/services/adminService";
import { toast } from "sonner";

export default function DeveloperManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [developersData, setDevelopersData] = useState<DevelopersData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDevelopersData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDevelopersData(currentPage);
        setDevelopersData(data);
      } catch (error) {
        toast.error("Failed to load developers data");
      } finally {
        setIsLoading(false);
      }
    };

    loadDevelopersData();
  }, [currentPage]);

  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return parts
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const totalDevelopers = developersData?.total_developers || 0;
  const displayedDevelopers = developersData?.developers || [];

  const filteredDevelopers = searchQuery
    ? displayedDevelopers.filter(
        (dev) =>
          dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dev.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : displayedDevelopers;

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
                Developers{" "}
                <span className="font-bold font-supply">
                  {totalDevelopers.toLocaleString()}
                </span>
              </h1>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#999999] h-4 w-4" />
                <Input
                  placeholder="Search developers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 border-0 rounded-3xl w-72 bg-[#78788029] placeholder:text-[#999999] text-[#232323] focus:ring-0 focus:border-gray-300"
                />
                <Mic className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999999] h-4 w-4" />
              </div>
            </div>
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
                  <div className="text-xs font-normal text-[#1E1E1E]">Email ID</div>
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
                <TableHead className="text-center font-medium text-gray-900">
                  <div className="text-[16px]">Rating</div>
                </TableHead>
                <TableHead className="text-center font-medium text-gray-900">
                  <div className="text-[16px]">Tasks</div>
                </TableHead>
                <TableHead className="text-center font-medium text-gray-900">
                  <div className="text-[16px]">Hour Paid</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevelopers.map((developer) => (
                <TableRow
                  key={developer.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-[#5E5ADB] text-white">
                          {getInitials(developer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-[16px] font-medium text-gray-900">
                          {developer.name}
                        </div>
                        <div className="text-sm text-gray-500">{developer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(developer.created_at)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(developer.last_login_at)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="text-gray-900">
                      {developer.average_rating.toFixed(1)} ({developer.rating_count})
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col gap-1 items-center">
                      <Badge variant="secondary" className="text-xs">
                        Solved: {developer.total_solved_tasks}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Progress: {developer.total_in_progress_task}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Pending: {developer.total_pending_task}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-gray-900">
                    ${developer.hour_paid}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-6 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {Math.ceil(totalDevelopers / 10)}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {[...Array(Math.min(5, Math.ceil(totalDevelopers / 10)))].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(Math.ceil(totalDevelopers / 10), prev + 1)
                    )
                  }
                  className={
                    currentPage >= Math.ceil(totalDevelopers / 10)
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
