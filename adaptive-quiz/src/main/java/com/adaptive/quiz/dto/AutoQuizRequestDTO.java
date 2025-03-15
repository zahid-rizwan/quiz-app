package com.adaptive.quiz.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class AutoQuizRequestDTO {
    @NotBlank(message = "Quiz title is required")
    private String quizTitle;

    private String description;

    @NotNull(message = "Difficulty level is required")
    private Integer difficultyLevel;

    @NotNull(message = "Number of questions is required")
    @Min(value = 1, message = "Number of questions must be at least 1")
    private Integer numberOfQuestions;

    @NotEmpty(message = "At least one subject is required")
    private List<Long> subjectIds;

    @NotEmpty(message = "At least one topic is required")
    private List<Long> topicIds;

    private boolean adaptive = false;
}