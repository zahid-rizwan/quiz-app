package com.adaptive.quiz.dto;

import lombok.*;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizCreateDTO {
    private String quizTitle;
    private String description;
    private Integer durationMinutes;
    private boolean isAdaptive;
    private Long subjectId;
    private Long topicId; // Add topicId
    private Set<QuizQuestionDTO> questions; // Add questions with options
}