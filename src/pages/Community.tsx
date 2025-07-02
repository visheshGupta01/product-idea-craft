import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Eye,
  ExternalLink,
  Star,
  Users,
  Calendar,
  Filter,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useUser } from "@/context/UserContext"; // ✅ import context

const Community = () => {
  const { user } = useUser(); // ✅ access user from context

  const projects = [
    // your project data remains the same...
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Beta":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        user={user}
        onLoginClick={() => {}}
        onSignupClick={() => {}}
        onLogout={() => {}}
      />

      {/* rest of your layout unchanged */}
    </div>
  );
};

export default Community;
