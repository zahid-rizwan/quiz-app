package com.adaptive.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizQuestionDTO {
    private Long questionId;
    private String questionText;
    private String explanation;
    private Integer difficultyLevel;
    private List<OptionDTO> options;
}
