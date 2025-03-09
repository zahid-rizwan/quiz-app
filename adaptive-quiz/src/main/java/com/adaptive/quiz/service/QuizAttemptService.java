package com.adaptive.quiz.service;

import com.adaptive.quiz.dto.*;
import jakarta.transaction.Transactional;

import java.util.List;

public interface QuizAttemptService {
    QuizAttemptDTO startQuiz(Long studentId, Long quizId);


    QuizAttemptDTO submitQuizResponse(Long attemptId, SubmitResponseDTO responseDTO);



    QuizAttemptDTO finishQuiz(Long attemptId);
    QuizResultDTO getQuizResult(Long attemptId);
    List<QuizAttemptDTO> getStudentAttempts(Long studentId);
    QuizQuestionDTO getNextQuestion(Long attemptId);
    StudentQuizResultDTO saveQuizResult(Long attemptId);
    List<StudentQuizResultDTO> getStudentResults(Long studentId);
    List<StudentQuizResultDTO> getStudentResultsByQuiz(Long studentId, Long quizId);
    Integer getUniqueQuizAttemptCount(Long studentId);
}
