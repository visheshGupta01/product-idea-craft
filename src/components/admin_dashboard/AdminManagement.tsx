import React, { useState, useEffect } from "react";
import { Search, Mic, ArrowUpDown, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  fetchAdminsData,
  AdminsData,
  Admin,
  createAdmin,
  updateUserCredits,
} from "@/services/adminService";
import { toast } from "sonner";

export default function AdminManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [adminsData, setAdminsData] = useState<AdminsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCreditsDialog, setShowCreditsDialog] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [creditsAmount, setCreditsAmount] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdatingCredits, setIsUpdatingCredits] = useState(false);

  useEffect(() => {
    const loadAdminsData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAdminsData(currentPage);
        setAdminsData(data);
      } catch (error) {
        toast.error("Failed to load admins data");
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminsData();
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

  const handleCreateAdmin = async () => {
    if (!newAdminEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      setIsCreating(true);
      const response = await createAdmin(newAdminEmail);
      if (response.success) {
        toast.success("Admin created successfully");
        setShowCreateDialog(false);
        setNewAdminEmail("");
        // Refresh data
        const data = await fetchAdminsData(currentPage);
        setAdminsData(data);
      } else {
        toast.error(response.message || "Failed to create admin");
      }
    } catch (error) {
      toast.error("Failed to create admin");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateCredits = async () => {
    if (!selectedAdmin || !creditsAmount.trim()) {
      toast.error("Please enter a valid credits amount");
      return;
    }

    const credits = parseInt(creditsAmount);
    if (isNaN(credits)) {
      toast.error("Please enter a valid number");
      return;
    }

    try {
      setIsUpdatingCredits(true);
      const response = await updateUserCredits(selectedAdmin.id, credits);
      if (response.success) {
        toast.success("Credits updated successfully");
        setShowCreditsDialog(false);
        setSelectedAdmin(null);
        setCreditsAmount("");
        // Refresh data
        const data = await fetchAdminsData(currentPage);
        setAdminsData(data);
      } else {
        toast.error(response.message || "Failed to update credits");
      }
    } catch (error) {
      toast.error("Failed to update credits");
    } finally {
      setIsUpdatingCredits(false);
    }
  };

  const openCreditsDialog = (admin: Admin) => {
    setSelectedAdmin(admin);
    setCreditsAmount(admin.credits.toString());
    setShowCreditsDialog(true);
  };

  const totalAdmins = adminsData?.total_admins || 0;
  const displayedAdmins = adminsData?.admins || [];

  const filteredAdmins = searchQuery
    ? displayedAdmins.filter(
        (admin) =>
          admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : displayedAdmins;

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
                Admins{" "}
                <span className="font-bold font-supply">
                  {totalAdmins.toLocaleString()}
                </span>
              </h1>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-primary text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Admin
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#999999] h-4 w-4" />
                <Input
                  placeholder="Search admins..."
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
                  <div className="text-[16px]">Plan</div>
                </TableHead>
                <TableHead className="text-center font-medium text-gray-900">
                  <div className="text-[16px]">Credits</div>
                </TableHead>
                <TableHead className="text-center font-medium text-gray-900">
                  <div className="text-[16px]">Actions</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.map((admin) => (
                <TableRow
                  key={admin.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-[#5E5ADB] text-white">
                          {getInitials(admin.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-[16px] font-medium text-gray-900">
                          {admin.name}
                        </div>
                        <div className="text-sm text-gray-500">{admin.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(admin.created_at)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(admin.last_login_at)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{admin.plan_name || "Free"}</Badge>
                  </TableCell>
                  <TableCell className="text-center text-gray-900">
                    {admin.credits}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openCreditsDialog(admin)}
                    >
                      Update Credits
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-6 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {Math.ceil(totalAdmins / 10)}
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
              {[...Array(Math.min(5, Math.ceil(totalAdmins / 10)))].map((_, idx) => {
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
                    setCurrentPage((prev) => Math.min(Math.ceil(totalAdmins / 10), prev + 1))
                  }
                  className={
                    currentPage >= Math.ceil(totalAdmins / 10)
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* Create Admin Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Admin</DialogTitle>
            <DialogDescription>
              Enter the email address of the user you want to make an admin.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Email address"
              type="email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAdmin} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Credits Dialog */}
      <Dialog open={showCreditsDialog} onOpenChange={setShowCreditsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Credits</DialogTitle>
            <DialogDescription>
              Update credits for {selectedAdmin?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Credits amount"
              type="number"
              value={creditsAmount}
              onChange={(e) => setCreditsAmount(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreditsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCredits} disabled={isUpdatingCredits}>
              {isUpdatingCredits ? "Updating..." : "Update Credits"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
