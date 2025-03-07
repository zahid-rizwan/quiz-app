package com.adaptive.quiz.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentRegistrationDTO {
    private String name;
    private String email;
    private String password;
}

