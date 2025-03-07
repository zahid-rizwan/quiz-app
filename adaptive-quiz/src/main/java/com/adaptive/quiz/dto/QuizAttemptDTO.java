package com.adaptive.quiz.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttemptDTO {
    private Long attemptId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer score;
    private Long studentId;
    private String studentName;
    private Long quizId;
    private String quizTitle;
}
