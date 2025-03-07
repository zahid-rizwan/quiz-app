package com.adaptive.quiz.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmitResponseDTO {
    private Long questionId;
    private Long selectedOptionId;
    private String textResponse;
}
