package com.adaptive.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherQuizDetailDTO {
    private Long quizId;
    private String quizTitle;
    private String description;
    private Integer durationMinutes;
    private LocalDateTime createdAt;
    private boolean isAdaptive;

    // Subject details
    private Long subjectId;
    private String subjectName;

    // Topic details
    private Long topicId;
    private String topicName;

    // Questions with answers
    private List<QuizQuestionDetailDTO> questions;
}