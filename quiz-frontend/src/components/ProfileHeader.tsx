import React from 'react';
import { Edit2 } from 'lucide-react';
import { useSelector } from 'react-redux';

interface ProfileHeaderProps {
  student: {
    name: string;
    program: string;
    year: number;
    image: string;
  };
  onEdit: () => void;
}

export default function ProfileHeader({ student, onEdit }: ProfileHeaderProps) {
  const {user}=useSelector((state)=>state.auth);
  return (
    <header className="bg-indigo-600 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
                <img
                  src={student.image}
                  alt="Student profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name || "John doe"}</h1>
              <p className="text-indigo-200">{student.program} • Year {student.year}</p>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="flex items-center px-4 py-2 bg-indigo-500 hover:bg-indigo-400 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        </div>
      </div>
    </header>
  );
}