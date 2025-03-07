package com.adaptive.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SubjectResponseDTO {
    private Long subjectId;
    private String subjectName;
    private String description;
    private List<TopicDTO> topics;
}
