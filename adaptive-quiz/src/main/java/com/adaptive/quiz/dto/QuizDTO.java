package com.adaptive.quiz.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizDTO {
    private Long quizId;
    private String quizTitle;
    private String description;
    private Integer durationMinutes;
    private LocalDateTime createdAt;
    private boolean isAdaptive;
    private Long teacherId;
    private String teacherName;
    private Long subjectId;
    private String subjectName;
    private Long topicId; // Add topicId
    private String topicName; // Add topicName
    private Set<Long> questionIds;
}