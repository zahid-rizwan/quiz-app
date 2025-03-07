package com.adaptive.quiz.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponseDTO {
    private Long responseId;
    private Long questionId;
    private Long selectedOptionId;
    private String textResponse;
    private boolean isCorrect;
}
