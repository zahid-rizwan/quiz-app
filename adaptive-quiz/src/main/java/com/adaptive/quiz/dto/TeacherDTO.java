package com.adaptive.quiz.dto;

import com.adaptive.quiz.entity.Teacher;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherDTO {
    private Long teacherId;
    private String name;
    private String email;
    private String specialization;

    // Constructor to convert from Teacher entity
    public TeacherDTO(Teacher teacher) {
        this.teacherId = teacher.getTeacherId();
        this.name = teacher.getName();
        this.email = teacher.getEmail();
        this.specialization = teacher.getSpecialization();
    }
}