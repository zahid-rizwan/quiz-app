package com.adaptive.quiz.service.serviceimpl;

import com.adaptive.quiz.dto.*;
import com.adaptive.quiz.entity.*;
import com.adaptive.quiz.exception.UserNotFoundException;
import com.adaptive.quiz.repository.*;
import com.adaptive.quiz.service.QuizAttemptService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class QuizAttemptServiceImpl implements QuizAttemptService {

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private StudentResponseRepository studentResponseRepository;

    @Transactional
    @Override
    public QuizAttemptDTO startQuiz(Long studentId, Long quizId) {
        Student student = studentRepository.findById(Math.toIntExact(studentId))
                .orElseThrow(() -> new UserNotFoundException("Student not found with id: " + studentId));

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new UserNotFoundException("Quiz not found with id: " + quizId));

        // Check if student already has an active attempt
        Optional<QuizAttempt> existingAttempt = quizAttemptRepository.findByStudentStudentIdAndQuizQuizId((long) studentId, quizId);
        if (existingAttempt.isPresent() && existingAttempt.get().getEndTime() == null) {
            return mapToDTO(existingAttempt.get());
        }

        QuizAttempt quizAttempt = new QuizAttempt();
        quizAttempt.setStartTime(LocalDateTime.now());
        quizAttempt.setStudent(student);
        quizAttempt.setQuiz(quiz);

        QuizAttempt savedAttempt = quizAttemptRepository.save(quizAttempt);
        return mapToDTO(savedAttempt);
    }



    @Transactional
    @Override
    public QuizAttemptDTO submitQuizResponse(Long attemptId, SubmitResponseDTO responseDTO) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new UserNotFoundException("Quiz attempt not found with id: " + attemptId));

        Question question = questionRepository.findById(responseDTO.getQuestionId())
                .orElseThrow(() -> new UserNotFoundException("Question not found with id: " + responseDTO.getQuestionId()));

        StudentResponse response = new StudentResponse();
        response.setQuizAttempt(attempt);
        response.setQuestion(question);

        boolean isCorrect = false;

//         For multiple choice questions
//        if (question.getQuestionType() != QuestionType.OPEN_ENDED && responseDTO.getSelectedOptionId() != null) {
            Option selectedOption = optionRepository.findById(responseDTO.getSelectedOptionId())
                    .orElseThrow(() -> new UserNotFoundException("Option not found with id: " + responseDTO.getSelectedOptionId()));

            response.setSelectedOption(selectedOption);
            isCorrect = selectedOption.isCorrect();
//        }
        // For open-ended questions

        response.setCorrect(isCorrect);
        studentResponseRepository.save(response);

        return mapToDTO(attempt);
    }

    @Override
    @Transactional
    public QuizAttemptDTO finishQuiz(Long attemptId) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new UserNotFoundException("Quiz attempt not found with id: " + attemptId));

        // Calculate score
        int totalCorrect = studentResponseRepository.countCorrectResponsesByAttemptId(attemptId);
        int totalQuestions = attempt.getQuiz().getQuestions().size();
        int score = (int) Math.round((double) totalCorrect / totalQuestions * 100);

        attempt.setEndTime(LocalDateTime.now());
        attempt.setScore(score);

        QuizAttempt finishedAttempt = quizAttemptRepository.save(attempt);
        return mapToDTO(finishedAttempt);
    }

    @Override
    public QuizResultDTO getQuizResult(Long attemptId) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new UserNotFoundException("Quiz attempt not found with id: " + attemptId));

        if (attempt.getEndTime() == null) {
            throw new RuntimeException("Quiz is not finished yet");
        }

        List<StudentResponse> responses = studentResponseRepository.findByQuizAttemptAttemptId(attemptId);
        int totalQuestions = attempt.getQuiz().getQuestions().size();
        int correctAnswers = (int) responses.stream().filter(StudentResponse::isCorrect).count();
        int wrongAnswers = totalQuestions - correctAnswers;

        QuizResultDTO resultDTO = new QuizResultDTO();
        resultDTO.setAttemptId(attemptId);
        resultDTO.setScore(attempt.getScore());
        resultDTO.setTotalQuestions(totalQuestions);
        resultDTO.setPercentage((double) attempt.getScore());
        resultDTO.setCorrectAnswers(correctAnswers);
        resultDTO.setWrongAnswers(wrongAnswers);

        return resultDTO;
    }

    @Override
    public List<QuizAttemptDTO> getStudentAttempts(Long studentId) {
        List<QuizAttempt> attempts = quizAttemptRepository.findByStudentStudentId(studentId);
        return attempts.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public QuizQuestionDTO getNextQuestion(Long attemptId) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new UserNotFoundException("Quiz attempt not found with id: " + attemptId));

        // Get questions already answered
        List<StudentResponse> responses = studentResponseRepository.findByQuizAttemptAttemptId(attemptId);
        Set<Long> answeredQuestionIds = responses.stream()
                .map(response -> response.getQuestion().getQuestionId())
                .collect(Collectors.toSet());

        // Get all quiz questions
        Set<Question> quizQuestions = attempt.getQuiz().getQuestions();

        // Find unanswered questions
        List<Question> unansweredQuestions = quizQuestions.stream()
                .filter(question -> !answeredQuestionIds.contains(question.getQuestionId()))
                .toList();

        if (unansweredQuestions.isEmpty()) {
            return null; // No more questions
        }

        Question nextQuestion;

        // For adaptive quizzes, select based on previous performance
        if (attempt.getQuiz().isAdaptive() && !responses.isEmpty()) {
            // Calculate current performance
            double correctRatio = responses.stream().filter(StudentResponse::isCorrect).count() / (double) responses.size();

            // Determine difficulty level for next question
            int targetDifficulty;
            if (correctRatio < 0.4) {
                targetDifficulty = 1; // Easy
            } else if (correctRatio < 0.7) {
                targetDifficulty = 3; // Medium
            } else {
                targetDifficulty = 5; // Hard
            }

            // Find questions of appropriate difficulty
            List<Question> filteredQuestions = unansweredQuestions.stream()
                    .filter(q -> Math.abs(q.getDifficultyLevel() - targetDifficulty) <= 1)
                    .collect(Collectors.toList());

            // If no questions of appropriate difficulty, use any unanswered question
            if (filteredQuestions.isEmpty()) {
                nextQuestion = unansweredQuestions.get(0);
            } else {
                // Select random question from filtered list
                int randomIndex = new Random().nextInt(filteredQuestions.size());
                nextQuestion = filteredQuestions.get(randomIndex);
            }
        } else {
            // For non-adaptive quizzes, select next question in sequence
            nextQuestion = unansweredQuestions.get(0);
        }

        // Map to DTO without showing correct answers
        QuizQuestionDTO questionDTO = new QuizQuestionDTO();
//        questionDTO.setQuestionId(nextQuestion.getQuestionId());
        questionDTO.setQuestionText(nextQuestion.getQuestionText());
//        questionDTO.setQuestionType(nextQuestion.getQuestionType());

        // Get options without marking correct answers
        List<Option> options = optionRepository.findByQuestionQuestionId(nextQuestion.getQuestionId());
        List<OptionDTO> optionDTOs = options.stream().map(option -> {
            OptionDTO optionDTO = new OptionDTO();
            optionDTO.setOptionId(option.getOptionId());
            optionDTO.setOptionText(option.getOptionText());
            // Don't expose correct answer
            optionDTO.setCorrect(false);
            return optionDTO;
        }).collect(Collectors.toList());

//        questionDTO.setOptions(optionDTOs);
        return questionDTO;
    }

    private QuizAttemptDTO mapToDTO(QuizAttempt attempt) {
        QuizAttemptDTO attemptDTO = new QuizAttemptDTO();
        attemptDTO.setAttemptId(attempt.getAttemptId());
        attemptDTO.setStartTime(attempt.getStartTime());
        attemptDTO.setEndTime(attempt.getEndTime());
        attemptDTO.setScore(attempt.getScore());
        attemptDTO.setStudentId((long) attempt.getStudent().getStudentId());
        attemptDTO.setStudentName(attempt.getStudent().getName());
        attemptDTO.setQuizId(attempt.getQuiz().getQuizId());
        attemptDTO.setQuizTitle(attempt.getQuiz().getQuizTitle());
        return attemptDTO;
    }
}