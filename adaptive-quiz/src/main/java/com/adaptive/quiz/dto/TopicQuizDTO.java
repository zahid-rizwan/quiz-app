package com.adaptive.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopicQuizDTO {
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
    private Long topicId;
    private String topicName;
    private List<QuizQuestionDetailDTO> questions;
}