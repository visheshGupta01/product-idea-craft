import React, { useState } from "react";
import { Search, Mic, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface User {
  id: string;
  name: string;
  email: string;
  plan: "Pro" | "Team" | "Free";
  signUpDate: string;
  lastLogin: string;
  projects: number;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Divya Kansal",
    email: "divyakansal99@gmail.com",
    plan: "Pro",
    signUpDate: "21/07/2025",
    lastLogin: "31/07/2025",
    projects: 2,
  },
  {
    id: "2",
    name: "Divya Kansal",
    email: "divyakansal99@gmail.com",
    plan: "Pro",
    signUpDate: "21/07/2025",
    lastLogin: "31/07/2025",
    projects: 2,
  },
  {
    id: "3",
    name: "Divya Kansal",
    email: "divyakansal99@gmail.com",
    plan: "Pro",
    signUpDate: "21/07/2025",
    lastLogin: "31/07/2025",
    projects: 2,
  },
  {
    id: "4",
    name: "Divya Kansal",
    email: "divyakansal99@gmail.com",
    plan: "Pro",
    signUpDate: "21/07/2025",
    lastLogin: "31/07/2025",
    projects: 2,
  },
  {
    id: "5",
    name: "Divya Kansal",
    email: "divyakansal99@gmail.com",
    plan: "Pro",
    signUpDate: "21/07/2025",
    lastLogin: "31/07/2025",
    projects: 2,
  },
  {
    id: "6",
    name: "Divya Kansal",
    email: "divyakansal99@gmail.com",
    plan: "Pro",
    signUpDate: "21/07/2025",
    lastLogin: "31/07/2025",
    projects: 2,
  },
  {
    id: "7",
    name: "Divya Kansal",
    email: "divyakansal99@gmail.com",
    plan: "Pro",
    signUpDate: "21/07/2025",
    lastLogin: "31/07/2025",
    projects: 2,
  },
];

export default function UserManagement() {
  const [activeFilter, setActiveFilter] = useState<string>("Pro");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const totalUsers = 30239;
  const totalPages = Math.ceil(totalUsers / pageSize);

  return (
    <div className="flex-1 ml-10 p-8 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold font-poppins text-gray-900">
                Users <span className="font-normal font-supply">30,239</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#999999] h-4 w-4" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 border-0 rounded-3xl w-72 bg-[#78788029] placeholder:text-[#999999] text-[#232323] focus:ring-0 focus:border-gray-300"
                />
                <Mic className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999999] h-4 w-4" />
              </div>

              <div className="flex gap-2">
                {["Pro", "Team", "Free"].map((filter) => (
                  <Badge
                    key={filter}
                    variant={activeFilter === filter ? "default" : "secondary"}
                    className={`cursor-pointer px-4 py-2 font-medium ${
                      activeFilter === filter
                        ? "bg-white text-[#313131] border border-black font-poppins"
                        : "bg-gray-200 text-[#999999] hover:bg-gray-300"
                    }`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                    {activeFilter === filter && (
                      <span className="ml-2 cursor-pointer">×</span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
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
                  <div className="text-xs font-normal text-[#1E1E1E]">
                    Email ID
                  </div>
                </TableHead>
                <TableHead className="text-left text-[16px] font-medium text-gray-900">
                  Plan
                </TableHead>
                <TableHead className="text-left font-medium text-gray-900">
                  <div className="flex text-[16px] items-center gap-2">
                    Sign Up Date
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
                <TableHead className="text-left text-[16px] font-medium text-gray-900">
                  Cancel Subscription
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <TableCell>
                    <div>
                      <div className="font-medium text-[18px] text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-900 ">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-900">{user.plan}</TableCell>
                  <TableCell className="text-gray-900">
                    {user.signUpDate}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {user.lastLogin}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {user.projects}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                    >
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}

        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="flex items-center gap-4">
            {/* left side: showing + select */}
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
              Out of total {totalUsers.toLocaleString()}
            </span>
          </div>

          <div className="ml-auto">
            <Pagination>
              <PaginationContent className="text-black flex gap-2">
                {/* prev / page select / next */}
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none" : ""}
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