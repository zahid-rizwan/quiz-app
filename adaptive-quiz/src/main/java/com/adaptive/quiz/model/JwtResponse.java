package com.adaptive.quiz.model;

import com.adaptive.quiz.dto.StudentDTO;
import com.adaptive.quiz.dto.TeacherDTO;
import com.adaptive.quiz.dto.UserDTO;
import com.adaptive.quiz.entity.Student;
import com.adaptive.quiz.entity.Teacher;
import com.adaptive.quiz.entity.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class JwtResponse {
    private String jwtToken;
    private UserDTO user;
    private StudentDTO student;
    private TeacherDTO teacher;
    private String primaryRole;

    // Constructor for basic authentication
    public JwtResponse(String jwtToken, User user) {
        this.jwtToken = jwtToken;
        this.user = new UserDTO(user);
        this.primaryRole = user.getRoles().stream()
                .findFirst()
                .map(r -> r.getName())
                .orElse("UNKNOWN");
    }

    // Constructor with student
    public JwtResponse(String jwtToken, User user, Student student) {
        this.jwtToken = jwtToken;
        this.user = new UserDTO(user);
        this.student = new StudentDTO(student);
        this.primaryRole = "STUDENT";
    }

    // Constructor with teacher
    public JwtResponse(String jwtToken, User user, Teacher teacher) {
        this.jwtToken = jwtToken;
        this.user = new UserDTO(user);
        this.teacher = new TeacherDTO(teacher);
        this.primaryRole = "TEACHER";
    }
}