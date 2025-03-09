package com.adaptive.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponseRequest {
    private Long questionId;
    private Long selectedOptionId;
    private Boolean correct;
}