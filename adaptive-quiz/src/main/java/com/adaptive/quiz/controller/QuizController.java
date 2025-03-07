package com.adaptive.quiz.controller;

import com.adaptive.quiz.dto.*;
import com.adaptive.quiz.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping("/teacher/{teacherId}")
    public ResponseEntity<ApiResponse<QuizDTO>> createQuiz(
            @PathVariable Long teacherId, @RequestBody QuizCreateDTO quizDTO) {
        QuizDTO createdQuiz = quizService.createQuiz(teacherId, quizDTO);
        ApiResponse<QuizDTO> response = new ApiResponse<>(true, "Quiz created successfully", createdQuiz);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<ApiResponse<QuizDTO>> getQuizById(@PathVariable Long quizId) {
        QuizDTO quizDTO = quizService.getQuizById(quizId);
        ApiResponse<QuizDTO> response = new ApiResponse<>(true, "Quiz retrieved successfully", quizDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<QuizDTO>>> getAllQuizzes() {
        List<QuizDTO> quizzes = quizService.getAllQuizzes();
        ApiResponse<List<QuizDTO>> response = new ApiResponse<>(true, "Quizzes retrieved successfully", quizzes);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<ApiResponse<List<QuizDTO>>> getQuizzesByTeacherId(@PathVariable Long teacherId) {
        List<QuizDTO> quizzes = quizService.getQuizzesByTeacherId(teacherId);
        ApiResponse<List<QuizDTO>> response = new ApiResponse<>(true, "Quizzes retrieved successfully", quizzes);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<ApiResponse<List<QuizDTO>>> getQuizzesBySubjectId(@PathVariable Long subjectId) {
        List<QuizDTO> quizzes = quizService.getQuizzesBySubjectId(subjectId);
        ApiResponse<List<QuizDTO>> response = new ApiResponse<>(true, "Quizzes retrieved successfully", quizzes);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/teacher/{teacherId}/detailed")
    public ResponseEntity<ApiResponse<List<TeacherQuizDetailDTO>>> getDetailedQuizzesByTeacherId(@PathVariable Long teacherId) {
        List<TeacherQuizDetailDTO> quizzes = quizService.getDetailedQuizzesByTeacherId(teacherId);
        ApiResponse<List<TeacherQuizDetailDTO>> response = new ApiResponse<>(true,
                "Teacher's quizzes with full details retrieved successfully", quizzes);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/subject/{subjectId}/with-questions")
    public ResponseEntity<ApiResponse<SubjectTopicsDTO>> getQuizzesBySubjectIdWithQuestions(@PathVariable Long subjectId) {
        SubjectTopicsDTO subjectWithTopics = quizService.getQuizzesBySubjectIdWithQuestions(subjectId);
        ApiResponse<SubjectTopicsDTO> response = new ApiResponse<>(true,
                "Subject with topics and questions retrieved successfully", subjectWithTopics);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{quizId}/questions")
    public ResponseEntity<ApiResponse<List<QuizQuestionDTO>>> getQuizQuestions(@PathVariable Long quizId) {
        List<QuizQuestionDTO> questions = quizService.getQuizQuestions(quizId);
        ApiResponse<List<QuizQuestionDTO>> response = new ApiResponse<>(true, "Quiz questions retrieved successfully", questions);
        return ResponseEntity.ok(response);
    }


    @PutMapping("/{quizId}")
    public ResponseEntity<ApiResponse<QuizDTO>> updateQuiz(
            @PathVariable Long quizId, @RequestBody QuizCreateDTO quizDTO) {
        QuizDTO updatedQuiz = quizService.updateQuiz(quizId, quizDTO);
        ApiResponse<QuizDTO> response = new ApiResponse<>(true, "Quiz updated successfully", updatedQuiz);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{quizId}")
    public ResponseEntity<ApiResponse<Void>> deleteQuiz(@PathVariable Long quizId) {
        quizService.deleteQuiz(quizId);
        ApiResponse<Void> response = new ApiResponse<>(true, "Quiz deleted successfully", null);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/topic/{topicId}")
    public ResponseEntity<ApiResponse<List<TopicQuizDTO>>> getQuizzesByTopicId(@PathVariable Long topicId) {
        List<TopicQuizDTO> quizzes = quizService.getQuizzesByTopicId(topicId);
        ApiResponse<List<TopicQuizDTO>> response = new ApiResponse<>(true,
                "Topic quizzes with detailed questions retrieved successfully", quizzes);
        return ResponseEntity.ok(response);
    }
}
