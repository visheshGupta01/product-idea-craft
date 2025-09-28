import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserTasksPage from '@/components/dashboard/TasksPage';

const UserTasks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route index element={<UserTasksPage />} />
      </Routes>
    </div>
  );
};

export default UserTasks;