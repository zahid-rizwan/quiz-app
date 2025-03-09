package com.adaptive.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
    private int studentId;
    private String name;
    private String email;
    private String university;
    private String program;
    private int semester;
    private String phone;
    private String address;
    private String bio;

    // Constructor to convert from Student entity
    public StudentDTO(com.adaptive.quiz.entity.Student student) {
        this.studentId = student.getStudentId();
        this.name = student.getName();
        this.email = student.getEmail();
        this.university = student.getUniversity();
        this.program = student.getProgram();
        this.semester = student.getSemester();
        this.phone = student.getPhone();
        this.address = student.getAddress();
        this.bio = student.getBio();
    }
}