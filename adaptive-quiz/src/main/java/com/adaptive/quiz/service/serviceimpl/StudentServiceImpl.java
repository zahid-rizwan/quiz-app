package com.adaptive.quiz.service.serviceimpl;

import com.adaptive.quiz.dto.StudentDTO;
import com.adaptive.quiz.dto.StudentRegistrationDTO;
import com.adaptive.quiz.entity.Student;
import com.adaptive.quiz.entity.User;
import com.adaptive.quiz.repository.StudentRepository;
import com.adaptive.quiz.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {
    @Autowired
    private StudentRepository studentRepository;
    @Override
    public Student addStudent(User user) {
        Student student = new Student();
        student.setName(user.getName());
        student.setEmail(user.getEmail());
        student.setUserId(user.getId());
        return studentRepository.save(student);
    }


    @Override
    public StudentDTO registerStudent(StudentRegistrationDTO registrationDTO) {
        return null;
    }

    @Override
    public StudentDTO getStudentById(Long studentId) {
        return null;
    }

    @Override
    public List<StudentDTO> getAllStudents() {
        return List.of();
    }

    @Override
    public StudentDTO updateStudent(Long studentId, StudentDTO studentDTO) {
        return null;
    }

    @Override
    public void deleteStudent(Long studentId) {

    }

    @Override
    public StudentDTO getStudentByEmail(String email) {
        return null;
    }
}
