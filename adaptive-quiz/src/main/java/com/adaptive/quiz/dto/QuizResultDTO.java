package com.adaptive.quiz.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizResultDTO {
    private Long attemptId;
    private Integer score;
    private Integer totalQuestions;
    private Double percentage;
    private Integer correctAnswers;
    private Integer wrongAnswers;
}
