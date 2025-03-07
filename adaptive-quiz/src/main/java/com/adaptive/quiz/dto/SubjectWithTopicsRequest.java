package com.adaptive.quiz.dto;

import lombok.Data;

import java.util.List;

@Data
public class SubjectWithTopicsRequest {
    private SubjectDTO subject;
    private List<TopicDTO> topics;
}
