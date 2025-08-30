import React from 'react';
import MyProjectsPage from '@/components/dashboard/MyProjectsPage';

const MyProjects = () => {
  return (
    <div className="pt-[60px]"> {/* Account for fixed navbar height */}
      <MyProjectsPage />
    </div>
  );
};

export default MyProjects;