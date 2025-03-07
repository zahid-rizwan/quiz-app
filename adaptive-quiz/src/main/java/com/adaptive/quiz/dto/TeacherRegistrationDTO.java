package com.adaptive.quiz.dto;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherRegistrationDTO {
    private String name;
    private String email;
    private String password;
    private String specialization;
}
