package com.adaptive.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizQuestionDetailDTO {
    private Long questionId;
    private String questionText;
    private String explanation;
    private Integer difficultyLevel;
    private List<OptionDetailDTO> options;
}