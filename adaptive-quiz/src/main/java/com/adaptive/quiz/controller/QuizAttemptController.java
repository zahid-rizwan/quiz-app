package com.adaptive.quiz.controller;

import com.adaptive.quiz.dto.*;
import com.adaptive.quiz.service.QuizAttemptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz-attempts")
public class QuizAttemptController {

    @Autowired
    private QuizAttemptService quizAttemptService;

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<QuizAttemptDTO>> startQuiz(@RequestBody StartQuizRequest request) {
        try {
            QuizAttemptDTO attempt = quizAttemptService.startQuiz(request.getStudentId(), request.getQuizId());
            return ResponseEntity.ok(new ApiResponse<>(true, "Quiz attempt started successfully", attempt));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/{attemptId}/submit")
    public ResponseEntity<ApiResponse<QuizAttemptDTO>> submitResponse(
            @PathVariable Long attemptId,
            @RequestBody SubmitResponseDTO response) {
        try {
            QuizAttemptDTO attempt = quizAttemptService.submitQuizResponse(attemptId, response);
            return ResponseEntity.ok(new ApiResponse<>(true, "Response submitted successfully", attempt));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/{attemptId}/finish")
    public ResponseEntity<ApiResponse<QuizAttemptDTO>> finishQuiz(@PathVariable Long attemptId) {
        try {
            QuizAttemptDTO attempt = quizAttemptService.finishQuiz(attemptId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Quiz finished successfully", attempt));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/{attemptId}/result")
    public ResponseEntity<ApiResponse<QuizResultDTO>> getQuizResult(@PathVariable Long attemptId) {
        try {
            QuizResultDTO result = quizAttemptService.getQuizResult(attemptId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Quiz result retrieved successfully", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<QuizAttemptDTO>>> getStudentAttempts(@PathVariable Long studentId) {
        try {
            List<QuizAttemptDTO> attempts = quizAttemptService.getStudentAttempts(studentId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Student attempts retrieved successfully", attempts));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}