package com.adaptive.quiz.dto;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TopicDTO {
    private Long topicId;
    private String topicName;
    private String description;
    private Long subjectId;
    private String subjectName;
}
