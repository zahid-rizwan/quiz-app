package com.adaptive.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubjectTopicsDTO {
    private Long subjectId;
    private String subjectName;
    private String description;
    private List<TopicQuestionsDTO> topics;
}