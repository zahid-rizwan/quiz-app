package com.adaptive.quiz.service;

import com.adaptive.quiz.dto.*;

import java.util.List;

public interface QuizService {
    QuizDTO createQuiz(Long teacherId, QuizCreateDTO quizDTO);
    QuizDTO getQuizById(Long quizId);
    List<QuizDTO> getAllQuizzes();
    List<QuizDTO> getQuizzesByTeacherId(Long teacherId);
    List<QuizDTO> getQuizzesBySubjectId(Long subjectId);
    QuizDTO updateQuiz(Long quizId, QuizCreateDTO quizDTO);
    void deleteQuiz(Long quizId);
    List<QuizQuestionDTO> getQuizQuestions(Long quizId);
    List<TopicQuizDTO> getQuizzesByTopicId(Long topicId);
    SubjectTopicsDTO getQuizzesBySubjectIdWithQuestions(Long subjectId);
    List<TeacherQuizDetailDTO> getDetailedQuizzesByTeacherId(Long teacherId);
    QuizDTO createAutomaticQuiz(Long teacherId, AutoQuizRequestDTO requestDTO);

}
