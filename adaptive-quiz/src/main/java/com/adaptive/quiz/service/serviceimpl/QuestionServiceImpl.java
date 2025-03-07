package com.adaptive.quiz.service.serviceimpl;

import com.adaptive.quiz.dto.OptionDTO;
import com.adaptive.quiz.dto.QuestionCreateDTO;
import com.adaptive.quiz.dto.QuestionDTO;
import com.adaptive.quiz.entity.Option;
import com.adaptive.quiz.entity.Question;
import com.adaptive.quiz.entity.Topic;
import com.adaptive.quiz.exception.UserNotFoundException;
import com.adaptive.quiz.repository.OptionRepository;
import com.adaptive.quiz.repository.QuestionRepository;
import com.adaptive.quiz.repository.TopicRepository;
import com.adaptive.quiz.service.QuestionService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Override
    @Transactional
    public QuestionDTO createQuestion(QuestionCreateDTO questionDTO) {
        Topic topic = topicRepository.findById(questionDTO.getTopicId())
                .orElseThrow(() -> new UserNotFoundException("Topic not found with id: " + questionDTO.getTopicId()));

        Question question = new Question();
        question.setQuestionText(questionDTO.getQuestionText());
        question.setExplanation(questionDTO.getExplanation());
        question.setDifficultyLevel(questionDTO.getDifficultyLevel());
//        question.setQuestionType(questionDTO.getQuestionType());
        question.setTopic(topic);

        Question savedQuestion = questionRepository.save(question);

        // Save options
        if (questionDTO.getOptions() != null && !questionDTO.getOptions().isEmpty()) {
            for (OptionDTO optionDTO : questionDTO.getOptions()) {
                Option option = new Option();
                option.setOptionText(optionDTO.getOptionText());
                option.setCorrect(optionDTO.isCorrect());
                option.setQuestion(savedQuestion);
                optionRepository.save(option);
            }
        }

        return getQuestionById(savedQuestion.getQuestionId());
    }

    @Override
    public QuestionDTO getQuestionById(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new UserNotFoundException("Question not found with id: " + questionId));
        return mapToDTO(question);
    }

    @Override
    public List<QuestionDTO> getAllQuestions() {
        List<Question> questions = questionRepository.findAll();
        return questions.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<QuestionDTO> getQuestionsByTopicId(Long topicId) {
        List<Question> questions = questionRepository.findByTopicTopicId(topicId);
        return questions.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<QuestionDTO> getQuestionsBySubjectId(Long subjectId) {
        List<Question> questions = questionRepository.findBySubjectId(subjectId);
        return questions.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public QuestionDTO updateQuestion(Long questionId, QuestionCreateDTO questionDTO) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new UserNotFoundException("Question not found with id: " + questionId));

        Topic topic = topicRepository.findById(questionDTO.getTopicId())
                .orElseThrow(() -> new UserNotFoundException("Topic not found with id: " + questionDTO.getTopicId()));

        question.setQuestionText(questionDTO.getQuestionText());
        question.setExplanation(questionDTO.getExplanation());
        question.setDifficultyLevel(questionDTO.getDifficultyLevel());
//        question.setQuestionType(questionDTO.getQuestionType());
        question.setTopic(topic);

        // Delete existing options
        List<Option> existingOptions = optionRepository.findByQuestionQuestionId(questionId);
        optionRepository.deleteAll(existingOptions);

        // Save new options
        if (questionDTO.getOptions() != null && !questionDTO.getOptions().isEmpty()) {
            for (OptionDTO optionDTO : questionDTO.getOptions()) {
                Option option = new Option();
                option.setOptionText(optionDTO.getOptionText());
                option.setCorrect(optionDTO.isCorrect());
                option.setQuestion(question);
                optionRepository.save(option);
            }
        }

        questionRepository.save(question);
        return getQuestionById(questionId);
    }

    @Override
    @Transactional
    public void deleteQuestion(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new UserNotFoundException("Question not found with id: " + questionId));

        // Delete options first
        List<Option> options = optionRepository.findByQuestionQuestionId(questionId);
        optionRepository.deleteAll(options);

        // Delete question
        questionRepository.delete(question);
    }

    private QuestionDTO mapToDTO(Question question) {
        QuestionDTO questionDTO = new QuestionDTO();
        questionDTO.setQuestionId(question.getQuestionId());
        questionDTO.setQuestionText(question.getQuestionText());
        questionDTO.setExplanation(question.getExplanation());
        questionDTO.setDifficultyLevel(question.getDifficultyLevel());
//        questionDTO.setQuestionType(question.getQuestionType());
        questionDTO.setTopicId(question.getTopic().getTopicId());
        questionDTO.setTopicName(question.getTopic().getTopicName());

        // Map options
        List<Option> options = optionRepository.findByQuestionQuestionId(question.getQuestionId());
        List<OptionDTO> optionDTOs = options.stream().map(option -> {
            OptionDTO optionDTO = new OptionDTO();
            optionDTO.setOptionId(option.getOptionId());
            optionDTO.setOptionText(option.getOptionText());
            optionDTO.setCorrect(option.isCorrect());
            return optionDTO;
        }).collect(Collectors.toList());

        questionDTO.setOptions(optionDTOs);
        return questionDTO;
    }
}
