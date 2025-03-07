package com.adaptive.quiz.service;

import com.adaptive.quiz.dto.TeacherDTO;
import com.adaptive.quiz.dto.TeacherRegistrationDTO;
import com.adaptive.quiz.entity.Teacher;
import com.adaptive.quiz.entity.User;

import java.util.List;

public interface TeacherService {
    TeacherDTO registerTeacher(TeacherRegistrationDTO registrationDTO);
    TeacherDTO getTeacherById(Long teacherId);
    TeacherDTO updateTeacher(Long teacherId, TeacherDTO teacherDTO);
    List<TeacherDTO> getAllTeachers();
    void deleteTeacher(Long teacherId);
    TeacherDTO getTeacherByEmail(String email);
    Teacher addTeacher(User user);
}
