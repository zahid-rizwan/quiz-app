package com.adaptive.quiz.dto;

import com.adaptive.quiz.entity.Student;
import com.adaptive.quiz.entity.Teacher;
import com.adaptive.quiz.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDataResponse {
    private String jwtToken;
    private User user;
    private String primaryRole;
    private Student student;
    private Teacher teacher;

    // Constructors, getters, and setters
}
