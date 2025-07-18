import React from "react";
import MainDashboard from "../components/MainDashboard";
import { useUser } from "@/context/UserContext";

const Dashboard = () => {
  const { userIdea } = useUser();
  
  return (
    <MainDashboard 
      userIdea={userIdea || "My App"} 
    />
  );
};

export default Dashboard;