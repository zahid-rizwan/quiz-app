package com.adaptive.quiz.service;

import com.adaptive.quiz.dto.QuestionCreateDTO;
import com.adaptive.quiz.dto.QuestionDTO;

import java.util.List;

public interface QuestionService {
    QuestionDTO createQuestion(QuestionCreateDTO questionDTO);
    QuestionDTO getQuestionById(Long questionId);
    List<QuestionDTO> getAllQuestions();
    List<QuestionDTO> getQuestionsByTopicId(Long topicId);
    List<QuestionDTO> getQuestionsBySubjectId(Long subjectId);
    QuestionDTO updateQuestion(Long questionId, QuestionCreateDTO questionDTO);
    void deleteQuestion(Long questionId);
}
