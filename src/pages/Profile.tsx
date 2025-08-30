import React from 'react';
import UserProfilePage from '@/components/dashboard/UserProfilePage';

const Profile = () => {
  return (
    <div className="pt-[60px]"> {/* Account for fixed navbar height */}
      <UserProfilePage />
    </div>
  );
};

export default Profile;