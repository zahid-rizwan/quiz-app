// src/components/ManageTeachers/AddTeacherModal.jsx
import React from "react";
import TeacherForm from "./TeacherForm";
import { X } from "lucide-react";

const AddTeacherModal = ({ isOpen, onClose, onAddTeacher }) => {
  if (!isOpen) return null;

  const handleSubmit = async (formData) => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.post("http://localhost:9090/admin/teachers", formData);
      onAddTeacher(response.data);
      onClose();
    } catch (err) {
      console.error("Error adding teacher:", err);
    }
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Add Teacher</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <TeacherForm onSubmit={handleSubmit} onClose={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTeacherModal;