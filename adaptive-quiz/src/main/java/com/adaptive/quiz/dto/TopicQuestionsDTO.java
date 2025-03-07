package com.adaptive.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopicQuestionsDTO {
    private Long topicId;
    private String topicName;
    private String description;
    private List<QuizQuestionDTO> questions;
}