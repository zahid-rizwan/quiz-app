package com.adaptive.quiz.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDTO {
    private Long questionId;
    private String questionText;
    private String explanation;
    private Integer difficultyLevel;
//    private QuestionType questionType;
    private Long topicId;
    private String topicName;
    private List<OptionDTO> options;
}
