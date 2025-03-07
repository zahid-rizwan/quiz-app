package com.adaptive.quiz.service;

import com.adaptive.quiz.dto.QuizAttemptDTO;
import com.adaptive.quiz.dto.QuizQuestionDTO;
import com.adaptive.quiz.dto.QuizResultDTO;
import com.adaptive.quiz.dto.SubmitResponseDTO;
import jakarta.transaction.Transactional;

import java.util.List;

public interface QuizAttemptService {
    QuizAttemptDTO startQuiz(Long studentId, Long quizId);


    QuizAttemptDTO submitQuizResponse(Long attemptId, SubmitResponseDTO responseDTO);



    QuizAttemptDTO finishQuiz(Long attemptId);
    QuizResultDTO getQuizResult(Long attemptId);
    List<QuizAttemptDTO> getStudentAttempts(Long studentId);
    QuizQuestionDTO getNextQuestion(Long attemptId);
}
