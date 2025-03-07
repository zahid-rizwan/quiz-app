import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import ProfileHeader from '../components/ProfileHeader';
import EditProfileModal from '../components/EditProfileModal';
import StatsGrid from '../components/profile/StatsGrid';
import PersonalInfo from '../components/profile/PersonalInfo';
import Achievements from '../components/profile/Achievements';
import RecentQuizzes from '../components/profile/RecentQuizzes';
import UpcomingQuizzes from '../components/profile/UpcomingQuizzes';
import StudyResources from '../components/profile/StudyResources';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import {logout} from '../store/slice/authSlice'

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useSelector((state)=>state.auth);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [studentData, setStudentData] = useState(user);
  const dispatch = useDispatch();

  const handleProfileUpdate = (newData: any) => {
    setStudentData(newData);
    toast.success('Profile updated successfully!');
  };

  const handleLogout = () => {
    dispatch(
      logout()
    );
    navigate('/login');
    toast.success('Logged out successfully!');
  };

  if (!studentData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      
      <ProfileHeader
        student={studentData}
        onEdit={() => setIsEditModalOpen(true)}
      />

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={studentData}
        onSave={handleProfileUpdate}
      />

      <main className="container mx-auto px-4 py-8">
        <StatsGrid />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <PersonalInfo student={studentData} />
            <Achievements />
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            <RecentQuizzes />
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                Performance Trend
              </h2>
              <div className="h-48 flex items-center justify-center text-gray-500">
                Performance graph visualization would go here
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <UpcomingQuizzes />
            <StudyResources />
          </div>
        </div>
      </main>
    </div>
  );
}