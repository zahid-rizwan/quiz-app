package com.adaptive.quiz.service.serviceimpl;

import com.adaptive.quiz.dto.*;
import com.adaptive.quiz.entity.*;
import com.adaptive.quiz.exception.InsufficientQuestionsException;
import com.adaptive.quiz.exception.UserNotFoundException;
import com.adaptive.quiz.repository.*;
import com.adaptive.quiz.service.QuizService;
import com.adaptive.quiz.service.TeacherService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizServiceImpl implements QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private OptionRepository optionRepository;
    @Autowired
    private  TopicRepository topicRepository;
    @Autowired
    private TeacherService teacherService;
    @Autowired
    private  StudentRepository studentRepository;

    @Transactional
    @Override
    public QuizDTO createQuiz(Long teacherId, QuizCreateDTO quizDTO) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new UserNotFoundException("Teacher not found with id: " + teacherId));

        Subject subject = subjectRepository.findById(quizDTO.getSubjectId())
                .orElseThrow(() -> new UserNotFoundException("Subject not found with id: " + quizDTO.getSubjectId()));

        Topic topic = topicRepository.findById(quizDTO.getTopicId())
                .orElseThrow(() -> new UserNotFoundException("Topic not found with id: " + quizDTO.getTopicId()));

        Quiz quiz = new Quiz();
        quiz.setQuizTitle(quizDTO.getQuizTitle());
        quiz.setDescription(quizDTO.getDescription());
        quiz.setDurationMinutes(quizDTO.getDurationMinutes());
        quiz.setCreatedAt(LocalDateTime.now());
        quiz.setAdaptive(quizDTO.isAdaptive());
        quiz.setTeacher(teacher);
        quiz.setSubject(subject);
        quiz.setTopic(topic);

        Quiz savedQuiz = quizRepository.save(quiz); // Save Quiz first

        // ✅ Save Questions before setting Options
        if (quizDTO.getQuestions() != null && !quizDTO.getQuestions().isEmpty()) {
            Set<Question> questions = new HashSet<>();
            for (QuizQuestionDTO questionDTO : quizDTO.getQuestions()) {
                Question question = new Question();
                question.setQuestionText(questionDTO.getQuestionText());
                question.setExplanation(questionDTO.getExplanation());
                question.setDifficultyLevel(questionDTO.getDifficultyLevel());
                question.setTopic(topic);

                Question savedQuestion = questionRepository.save(question); // ✅ Save Question first

                Set<Option> options = new HashSet<>();
                for (OptionDTO optionDTO : questionDTO.getOptions()) {

                        System.out.println("Option text: " + optionDTO.getOptionText() + ", isCorrect: " + optionDTO.isCorrect());

                    Option option = new Option();
                    option.setOptionText(optionDTO.getOptionText());
                    option.setCorrect(optionDTO.isCorrect());
                    option.setQuestion(savedQuestion); // ✅ Now the Question is saved
                    options.add(option);
                }
                savedQuestion.setOptions(options);
                questionRepository.save(savedQuestion); // ✅ Save again with options

                questions.add(savedQuestion);
            }
            savedQuiz.setQuestions(questions);
            quizRepository.save(savedQuiz);
        }

        return mapToDTO(savedQuiz);
    }


    @Override
    public QuizDTO getQuizById(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new UserNotFoundException("Quiz not found with id: " + quizId));
        return mapToDTO(quiz);
    }

    @Override
    public List<QuizDTO> getAllQuizzes() {
        List<Quiz> quizzes = quizRepository.findAll();
        return quizzes.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<QuizDTO> getQuizzesByTeacherId(Long teacherId) {
        List<Quiz> quizzes = quizRepository.findByTeacherTeacherId(teacherId);
        return quizzes.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<QuizDTO> getQuizzesBySubjectId(Long subjectId) {
        List<Quiz> quizzes = quizRepository.findBySubjectSubjectId(subjectId);
        return quizzes.stream().map(this::mapToDTO).collect(Collectors.toList());
    }
    @Override
    public List<TopicQuizDTO> getQuizzesByTopicId(Long topicId) {
        // Verify topic exists
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new UserNotFoundException("Topic not found with id: " + topicId));

        // Get all quizzes for this topic
        List<Quiz> quizzes = quizRepository.findByTopicTopicId(topicId);

        // Convert to specific DTOs with detailed questions including correct answers
        return quizzes.stream().map(quiz -> {
            TopicQuizDTO quizDTO = new TopicQuizDTO();

            // Set basic quiz properties
            quizDTO.setQuizId(quiz.getQuizId());
            quizDTO.setQuizTitle(quiz.getQuizTitle());
            quizDTO.setDescription(quiz.getDescription());
            quizDTO.setDurationMinutes(quiz.getDurationMinutes());
            quizDTO.setCreatedAt(quiz.getCreatedAt());
            quizDTO.setAdaptive(quiz.isAdaptive());

            // Set teacher info
            quizDTO.setTeacherId(quiz.getTeacher().getTeacherId());
            quizDTO.setTeacherName(quiz.getTeacher().getName());

            // Set subject info
            quizDTO.setSubjectId(quiz.getSubject().getSubjectId());
            quizDTO.setSubjectName(quiz.getSubject().getSubjectName());

            // Set topic info
            quizDTO.setTopicId(quiz.getTopic().getTopicId());
            quizDTO.setTopicName(quiz.getTopic().getTopicName());

            // Set detailed questions with options including correct answers
            List<QuizQuestionDetailDTO> questionDTOs = new ArrayList<>();
            for (Question question : quiz.getQuestions()) {
                QuizQuestionDetailDTO questionDTO = mapToQuestionDetailDTO(question);
                questionDTOs.add(questionDTO);
            }
            quizDTO.setQuestions(questionDTOs);

            return quizDTO;
        }).collect(Collectors.toList());
    }
    @Override
    public List<TeacherQuizDetailDTO> getDetailedQuizzesByTeacherId(Long teacherId) {
        // Verify teacher exists
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new UserNotFoundException("Teacher not found with id: " + teacherId));

        // Get all quizzes for this teacher
        List<Quiz> quizzes = quizRepository.findByTeacherTeacherId(teacherId);

        // Convert to detailed DTOs
        return quizzes.stream().map(quiz -> {
            TeacherQuizDetailDTO quizDTO = new TeacherQuizDetailDTO();

            // Set basic quiz info
            quizDTO.setQuizId(quiz.getQuizId());
            quizDTO.setQuizTitle(quiz.getQuizTitle());
            quizDTO.setDescription(quiz.getDescription());
            quizDTO.setDurationMinutes(quiz.getDurationMinutes());
            quizDTO.setCreatedAt(quiz.getCreatedAt());
            quizDTO.setAdaptive(quiz.isAdaptive());

            // Set subject info
            quizDTO.setSubjectId(quiz.getSubject().getSubjectId());
            quizDTO.setSubjectName(quiz.getSubject().getSubjectName());

            // Set topic info
            quizDTO.setTopicId(quiz.getTopic().getTopicId());
            quizDTO.setTopicName(quiz.getTopic().getTopicName());

            // Set questions with options including correct answers
            List<QuizQuestionDetailDTO> questionDTOs = new ArrayList<>();
            for (Question question : quiz.getQuestions()) {
                questionDTOs.add(mapToQuestionDetailDTO(question));
            }
            quizDTO.setQuestions(questionDTOs);

            return quizDTO;
        }).collect(Collectors.toList());
    }
    private QuizQuestionDetailDTO mapToQuestionDetailDTO(Question question) {
        QuizQuestionDetailDTO questionDTO = new QuizQuestionDetailDTO();
        questionDTO.setQuestionId(question.getQuestionId());
        questionDTO.setQuestionText(question.getQuestionText());
        questionDTO.setExplanation(question.getExplanation());
        questionDTO.setDifficultyLevel(question.getDifficultyLevel());

        // Get options with correct answers
        List<Option> options = optionRepository.findByQuestionQuestionId(question.getQuestionId());
        List<OptionDetailDTO> optionDTOs = options.stream().map(option -> {
            OptionDetailDTO optionDTO = new OptionDetailDTO();
            optionDTO.setOptionId(option.getOptionId());
            optionDTO.setOptionText(option.getOptionText());
            optionDTO.setCorrect(option.isCorrect()); // Include correct answers
            return optionDTO;
        }).collect(Collectors.toList());

        questionDTO.setOptions(optionDTOs);
        return questionDTO;
    }
    @Override
    public SubjectTopicsDTO getQuizzesBySubjectIdWithQuestions(Long subjectId) {
        // Verify subject exists
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new UserNotFoundException("Subject not found with id: " + subjectId));

        // Create the subject DTO
        SubjectTopicsDTO subjectDTO = new SubjectTopicsDTO();
        subjectDTO.setSubjectId(subject.getSubjectId());
        subjectDTO.setSubjectName(subject.getSubjectName());
        subjectDTO.setDescription(subject.getDescription());

        // Get all topics for this subject
        List<Topic> topics = topicRepository.findBySubjectSubjectId(subjectId);

        // For each topic, get questions and create DTOs
        List<TopicQuestionsDTO> topicDTOs = topics.stream().map(topic -> {
            TopicQuestionsDTO topicDTO = new TopicQuestionsDTO();
            topicDTO.setTopicId(topic.getTopicId());
            topicDTO.setTopicName(topic.getTopicName());
            topicDTO.setDescription(topic.getDescription());

            // Get all questions for this topic
            List<Question> questions = questionRepository.findByTopicTopicId(topic.getTopicId());

            // Convert to detailed DTOs with options including correct answers
            List<QuizQuestionDTO> questionDTOs = questions.stream()
                    .map(question -> {
                        QuizQuestionDTO questionDTO = new QuizQuestionDTO();
                        questionDTO.setQuestionId(question.getQuestionId());
                        questionDTO.setQuestionText(question.getQuestionText());
                        questionDTO.setExplanation(question.getExplanation());
                        questionDTO.setDifficultyLevel(question.getDifficultyLevel());

                        // Get options with correct answers
                        List<Option> options = optionRepository.findByQuestionQuestionId(question.getQuestionId());
                        List<OptionDTO> optionDTOs = options.stream().map(option -> {
                            OptionDTO optionDTO = new OptionDTO();
                            optionDTO.setOptionId(option.getOptionId());
                            optionDTO.setOptionText(option.getOptionText());
                            optionDTO.setCorrect(option.isCorrect()); // Include correct answers
                            return optionDTO;
                        }).collect(Collectors.toList());

                        questionDTO.setOptions(optionDTOs);
                        return questionDTO;
                    })
                    .collect(Collectors.toList());

            topicDTO.setQuestions(questionDTOs);
            return topicDTO;
        }).collect(Collectors.toList());

        subjectDTO.setTopics(topicDTOs);
        return subjectDTO;
    }

    @Override
    @Transactional
    public QuizDTO updateQuiz(Long quizId, QuizCreateDTO quizDTO) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new UserNotFoundException("Quiz not found with id: " + quizId));

        Subject subject = subjectRepository.findById(quizDTO.getSubjectId())
                .orElseThrow(() -> new UserNotFoundException("Subject not found with id: " + quizDTO.getSubjectId()));

        quiz.setQuizTitle(quizDTO.getQuizTitle());
        quiz.setDescription(quizDTO.getDescription());
        quiz.setDurationMinutes(quizDTO.getDurationMinutes());
        quiz.setAdaptive(quizDTO.isAdaptive());
        quiz.setSubject(subject);

        // Update questions
//        if (quizDTO.getQuestionIds() != null) {
//            Set<Question> questions = new HashSet<>();
//            for (Long questionId : quizDTO.getQuestionIds()) {
//                Question question = questionRepository.findById(questionId)
//                        .orElseThrow(() -> new UserNotFoundException("Question not found with id: " + questionId));
//                questions.add(question);
//            }
//            quiz.setQuestions(questions);
//        }

        Quiz updatedQuiz = quizRepository.save(quiz);
        return mapToDTO(updatedQuiz);
    }

    @Override
    public void deleteQuiz(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new UserNotFoundException("Quiz not found with id: " + quizId));
        quizRepository.delete(quiz);
    }

    @Override
    public List<QuizQuestionDTO> getQuizQuestions(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new UserNotFoundException("Quiz not found with id: " + quizId));

        List<QuizQuestionDTO> quizQuestions = new ArrayList<>();

        for (Question question : quiz.getQuestions()) {
            QuizQuestionDTO questionDTO = new QuizQuestionDTO();
//            questionDTO.setQuestionId(question.getQuestionId());
            questionDTO.setQuestionText(question.getQuestionText());
//            questionDTO.setQuestionType(question.getQuestionType());

            // Get options but don't include correct answer flag for quiz display
            List<Option> options = optionRepository.findByQuestionQuestionId(question.getQuestionId());
            List<OptionDTO> optionDTOs = options.stream().map(option -> {
                OptionDTO optionDTO = new OptionDTO();
                optionDTO.setOptionId(option.getOptionId());
                optionDTO.setOptionText(option.getOptionText());
                // We don't send the isCorrect flag to the student
                optionDTO.setCorrect(false);
                return optionDTO;
            }).collect(Collectors.toList());

//            questionDTO.setOptions(optionDTOs);
            quizQuestions.add(questionDTO);
        }

        return quizQuestions;
    }
    @Transactional
    @Override
    public QuizDTO createAutomaticQuiz(Long studentId, AutoQuizRequestDTO requestDTO) {
        // Validate teacher
//        Teacher teacher = teacherRepository.findById(teacherId)
//                .orElseThrow(() -> new UserNotFoundException("Teacher not found with id: " + teacherId));
        Student student = studentRepository.findById(Math.toIntExact(studentId)).orElseThrow(()->new UserNotFoundException("Student not found with id: " + studentId));


        // Validate subjects exist
        List<Subject> subjects = new ArrayList<>();
        for (Long subjectId : requestDTO.getSubjectIds()) {
            Subject subject = subjectRepository.findById(subjectId)
                    .orElseThrow(() -> new UserNotFoundException("Subject not found with id: " + subjectId));
            subjects.add(subject);
        }

        // Validate topics exist
        List<Topic> topics = new ArrayList<>();
        for (Long topicId : requestDTO.getTopicIds()) {
            Topic topic = topicRepository.findById(topicId)
                    .orElseThrow(() -> new UserNotFoundException("Topic not found with id: " + topicId));
            topics.add(topic);
        }

        // Find questions matching the criteria
        List<Question> matchingQuestions = questionRepository.findByTopicInAndDifficultyLevel(
                topics,
                requestDTO.getDifficultyLevel()
        );

        if (matchingQuestions.size() < requestDTO.getNumberOfQuestions()) {
            throw new InsufficientQuestionsException(
                    "Not enough questions available with the specified criteria. " +
                            "Found " + matchingQuestions.size() + " questions, but " +
                            requestDTO.getNumberOfQuestions() + " were requested."
            );
        }

        // Randomly select the required number of questions
        Collections.shuffle(matchingQuestions);
        List<Question> selectedQuestions = matchingQuestions.subList(0, requestDTO.getNumberOfQuestions());

        // Calculate duration: 1.5 minutes per question
        int durationMinutes = (int) Math.ceil(requestDTO.getNumberOfQuestions() * 1.5);

        // Create quiz
        Quiz quiz = new Quiz();
        quiz.setQuizTitle(requestDTO.getQuizTitle());
        quiz.setDescription(requestDTO.getDescription());
        quiz.setDurationMinutes(durationMinutes);
        quiz.setCreatedAt(LocalDateTime.now());
        quiz.setAdaptive(requestDTO.isAdaptive());
//        quiz.setTeacher(teacher);
        quiz.setStudentId(Math.toIntExact(studentId));

        // Assign primary subject and topic
        // For simplicity, we'll use the first subject and topic from the lists
        quiz.setSubject(subjects.get(0));
        quiz.setTopic(topics.get(0));

        // Set questions
        quiz.setQuestions(new HashSet<>(selectedQuestions));

        // Save quiz
        Quiz savedQuiz = quizRepository.save(quiz);

        // Return DTO
        return mapToDTO(savedQuiz);
    }

    private QuizDTO mapToDTO(Quiz quiz) {
        QuizDTO quizDTO = new QuizDTO();
        quizDTO.setQuizId(quiz.getQuizId());
        quizDTO.setQuizTitle(quiz.getQuizTitle());
        quizDTO.setDescription(quiz.getDescription());
        quizDTO.setDurationMinutes(quiz.getDurationMinutes());
        quizDTO.setCreatedAt(quiz.getCreatedAt());
        quizDTO.setAdaptive(quiz.isAdaptive());
//        quizDTO.setTeacherId(quiz.getTeacher().getTeacherId());
//        quizDTO.setTeacherName(quiz.getTeacher().getName());
        quizDTO.setSubjectId(quiz.getSubject().getSubjectId());
        quizDTO.setSubjectName(quiz.getSubject().getSubjectName());
        quizDTO.setTopicId(quiz.getTopic().getTopicId()); // Set topicId
        quizDTO.setTopicName(quiz.getTopic().getTopicName()); // Set topicName

        // Map questions with their details
        Set<QuizQuestionDetailDTO> questionDetails = quiz.getQuestions().stream()
                .map(question -> {
                    QuizQuestionDetailDTO questionDetailDTO = new QuizQuestionDetailDTO();
                    questionDetailDTO.setQuestionId(question.getQuestionId());
                    questionDetailDTO.setQuestionText(question.getQuestionText());
                    questionDetailDTO.setExplanation(question.getExplanation());
                    questionDetailDTO.setDifficultyLevel(question.getDifficultyLevel());

                    // Map options
                    List<OptionDetailDTO> optionDetails = question.getOptions().stream()
                            .map(option -> {
                                OptionDetailDTO optionDetailDTO = new OptionDetailDTO();
                                optionDetailDTO.setOptionId(option.getOptionId());
                                optionDetailDTO.setOptionText(option.getOptionText());
                                optionDetailDTO.setCorrect(option.isCorrect());
                                return optionDetailDTO;
                            })
                            .collect(Collectors.toList());

                    questionDetailDTO.setOptions(optionDetails);
                    return questionDetailDTO;
                })
                .collect(Collectors.toSet());

        quizDTO.setQuestions(questionDetails);

        return quizDTO;
    }
}
