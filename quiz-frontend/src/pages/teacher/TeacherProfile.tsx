import React, { useState } from 'react';
import { Mail, Phone, MapPin, Award, BookOpen, Users, Edit2 } from 'lucide-react';
import EditTeacherProfileModal from '../../components/teacher/EditTeacherProfileModal';
import profile from "../../assets/profile.webp"

export default function TeacherProfile() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [teacherData, setTeacherData] = useState({
    name: 'Md Nazish',
    email: 'nazish@manuu.edu',
    phone: '+91 9631799182',
    department: 'Computer Science',
    office: 'Room 405, Building B',
    specialization: 'Database Systems & Machine Learning',
    education: [
      'Ph.D. in Computer Science, MANUU',
      'M.S. in Computer Science, MANUU',
      'B.S. in Computer Engineering, UC MANUU'
    ],
    courses: [
      'Database Management Systems',
      'Advanced Data Structures',
      'Machine Learning Fundamentals'
    ],
    image: profile,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white mr-6">
                <img
                  src={teacherData.image}
                  alt="Teacher profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{teacherData.name}</h1>
                <p className="text-indigo-200">{teacherData.department}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center px-4 py-2 bg-indigo-500 hover:bg-indigo-400 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">About Me</h2>
              <p className="text-gray-600 mb-6">{teacherData.specialization}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-2" />
                  {teacherData.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-2" />
                  {teacherData.phone}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  {teacherData.office}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Education</h2>
              <div className="space-y-3">
                {teacherData.education.map((edu, index) => (
                  <div key={index} className="flex items-center">
                    <Award className="w-5 h-5 text-indigo-600 mr-2" />
                    <span>{edu}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Current Courses</h2>
              <div className="space-y-3">
                {teacherData.courses.map((course, index) => (
                  <div key={index} className="flex items-center">
                    <BookOpen className="w-5 h-5 text-indigo-600 mr-2" />
                    <span>{course}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Statistics</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-indigo-600 mr-2" />
                    <span>Total Students</span>
                  </div>
                  <span className="font-semibold">245</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-indigo-600 mr-2" />
                    <span>Years Teaching</span>
                  </div>
                  <span className="font-semibold">8</span>
                </div>
              </div>
            </div>

            {/* <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Office Hours</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday</span>
                  <span>10:00 AM - 12:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Wednesday</span>
                  <span>2:00 PM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday</span>
                  <span>1:00 PM - 3:00 PM</span>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <EditTeacherProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        teacher={teacherData}
        onSave={(data) => {
          setTeacherData(data);
          setIsEditModalOpen(false);
        }}
      />
    </div>
  );
}