package com.adaptive.quiz.service.serviceimpl;

import com.adaptive.quiz.dto.TeacherDTO;
import com.adaptive.quiz.dto.TeacherRegistrationDTO;
import com.adaptive.quiz.entity.Teacher;
import com.adaptive.quiz.entity.User;
import com.adaptive.quiz.exception.UserNotFoundException;
import com.adaptive.quiz.repository.TeacherRepository;
import com.adaptive.quiz.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherServiceImpl implements TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    @Override
    public Teacher addTeacher(User user) {
        Teacher teacher = new Teacher();
        teacher.setName(user.getName());
        teacher.setEmail(user.getEmail());
        Teacher savedTeacher = teacherRepository.save(teacher);
        return teacher;
    }


    @Override
    public TeacherDTO registerTeacher(TeacherRegistrationDTO registrationDTO) {
        if (teacherRepository.existsByEmail(registrationDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Teacher teacher = new Teacher();
        teacher.setName(registrationDTO.getName());
        teacher.setEmail(registrationDTO.getEmail());
        teacher.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        teacher.setSpecialization(registrationDTO.getSpecialization());

        Teacher savedTeacher = teacherRepository.save(teacher);
        return mapToDTO(savedTeacher);
    }

    @Override
    public TeacherDTO getTeacherById(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new UserNotFoundException("Teacher not found with id: " + teacherId));
        return mapToDTO(teacher);
    }

    @Override
    public List<TeacherDTO> getAllTeachers() {
        List<Teacher> teachers = teacherRepository.findAll();
        return teachers.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public TeacherDTO updateTeacher(Long teacherId, TeacherDTO teacherDTO) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new UserNotFoundException("Teacher not found with id: " + teacherId));

        teacher.setName(teacherDTO.getName());
        teacher.setSpecialization(teacherDTO.getSpecialization());

        Teacher updatedTeacher = teacherRepository.save(teacher);
        return mapToDTO(updatedTeacher);
    }

    @Override
    public void deleteTeacher(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new UserNotFoundException("Teacher not found with id: " + teacherId));
        teacherRepository.delete(teacher);
    }

    @Override
    public TeacherDTO getTeacherByEmail(String email) {
        Teacher teacher = teacherRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Teacher not found with email: " + email));
        return mapToDTO(teacher);
    }



    private TeacherDTO mapToDTO(Teacher teacher) {
        TeacherDTO teacherDTO = new TeacherDTO();
        teacherDTO.setTeacherId(teacher.getTeacherId());
        teacherDTO.setName(teacher.getName());
        teacherDTO.setEmail(teacher.getEmail());
        teacherDTO.setSpecialization(teacher.getSpecialization());
        return teacherDTO;
    }
}
