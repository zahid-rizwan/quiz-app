import React from 'react';
import { User } from 'lucide-react';
import { User as UserType } from '../../types/auth';

interface PersonalInfoProps {
  student: UserType;
}

export default function PersonalInfo({ student }: PersonalInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <User className="w-5 h-5 mr-2 text-indigo-600" />
        Personal Information
      </h2>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">Student ID</p>
          <p className="font-medium">{student.studentId}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{student.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Program</p>
          <p className="font-medium">{student.program}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Advisor</p>
          <p className="font-medium">{student.advisor}</p>
        </div>
      </div>
    </div>
  );
}