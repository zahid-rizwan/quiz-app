package com.adaptive.quiz.controller;

import com.adaptive.quiz.dto.ApiResponse;
import com.adaptive.quiz.dto.QuestionCreateDTO;
import com.adaptive.quiz.dto.QuestionDTO;
import com.adaptive.quiz.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @PostMapping
    public ResponseEntity<ApiResponse<QuestionDTO>> createQuestion(@RequestBody QuestionCreateDTO questionDTO) {
        QuestionDTO createdQuestion = questionService.createQuestion(questionDTO);
        ApiResponse<QuestionDTO> response = new ApiResponse<>(true, "Question created successfully", createdQuestion);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{questionId}")
    public ResponseEntity<ApiResponse<QuestionDTO>> getQuestionById(@PathVariable Long questionId) {
        QuestionDTO questionDTO = questionService.getQuestionById(questionId);
        ApiResponse<QuestionDTO> response = new ApiResponse<>(true, "Question retrieved successfully", questionDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<QuestionDTO>>> getAllQuestions() {
        List<QuestionDTO> questions = questionService.getAllQuestions();
        ApiResponse<List<QuestionDTO>> response = new ApiResponse<>(true, "Questions retrieved successfully", questions);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/topic/{topicId}")
    public ResponseEntity<ApiResponse<List<QuestionDTO>>> getQuestionsByTopicId(@PathVariable Long topicId) {
        List<QuestionDTO> questions = questionService.getQuestionsByTopicId(topicId);
        ApiResponse<List<QuestionDTO>> response = new ApiResponse<>(true, "Questions retrieved successfully", questions);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<ApiResponse<List<QuestionDTO>>> getQuestionsBySubjectId(@PathVariable Long subjectId) {
        List<QuestionDTO> questions = questionService.getQuestionsBySubjectId(subjectId);
        ApiResponse<List<QuestionDTO>> response = new ApiResponse<>(true, "Questions retrieved successfully", questions);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{questionId}")
    public ResponseEntity<ApiResponse<QuestionDTO>> updateQuestion(
            @PathVariable Long questionId, @RequestBody QuestionCreateDTO questionDTO) {
        QuestionDTO updatedQuestion = questionService.updateQuestion(questionId, questionDTO);
        ApiResponse<QuestionDTO> response = new ApiResponse<>(true, "Question updated successfully", updatedQuestion);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(@PathVariable Long questionId) {
        questionService.deleteQuestion(questionId);
        ApiResponse<Void> response = new ApiResponse<>(true, "Question deleted successfully", null);
        return ResponseEntity.ok(response);
    }
}

