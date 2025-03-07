package com.adaptive.quiz.service;

import com.adaptive.quiz.dto.StudentDTO;
import com.adaptive.quiz.dto.StudentRegistrationDTO;
import com.adaptive.quiz.entity.Student;
import com.adaptive.quiz.entity.User;

import java.util.List;

public interface StudentService {
    Student addStudent(User user);
    StudentDTO registerStudent(StudentRegistrationDTO registrationDTO);
    StudentDTO getStudentById(Long studentId);
    List<StudentDTO> getAllStudents();
    StudentDTO updateStudent(Long studentId, StudentDTO studentDTO);
    void deleteStudent(Long studentId);
    StudentDTO getStudentByEmail(String email);

}
