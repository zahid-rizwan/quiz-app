package com.adaptive.quiz.service.serviceimpl;

import com.adaptive.quiz.dto.SubjectDTO;
import com.adaptive.quiz.dto.SubjectResponseDTO;
import com.adaptive.quiz.dto.TopicDTO;
import com.adaptive.quiz.entity.Subject;
import com.adaptive.quiz.entity.Topic;
import com.adaptive.quiz.exception.UserNotFoundException;
import com.adaptive.quiz.repository.SubjectRepository;
import com.adaptive.quiz.repository.TopicRepository;
import com.adaptive.quiz.service.SubjectService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubjectServiceImpl implements SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private TopicRepository topicRepository;

    @Override
    public SubjectDTO createSubject(SubjectDTO subjectDTO) {
        if (subjectRepository.existsBySubjectName(subjectDTO.getSubjectName())) {
            throw new RuntimeException("Subject with this name already exists");
        }

        Subject subject = new Subject();
        subject.setSubjectName(subjectDTO.getSubjectName());
        subject.setDescription(subjectDTO.getDescription());

        Subject savedSubject = subjectRepository.save(subject);
        return mapToDTO(savedSubject);
    }// Ensure the session is open
    @Override
    @Transactional
    public SubjectResponseDTO getSubjectById(Long subjectId) {
        // Use the custom method with EntityGraph to eagerly load topics
        Subject subject = subjectRepository.findByIdWithTopics(subjectId)
                .orElseThrow(() -> new UserNotFoundException("Subject not found with ID: " + subjectId));

        // Convert to response DTO
        return mapToSubjectResponseDTO(subject);
    }
    @Override
    @Transactional
    public List<SubjectResponseDTO> getAllSubjectsWithTopics() {
        // Fetch all subjects with their topics
        List<Subject> subjects = subjectRepository.findAllWithTopicsFetchJoin();

        // Convert to DTOs
        return subjects.stream()
                .map(this::mapToSubjectResponseDTO)
                .collect(Collectors.toList());
    }

    public List<SubjectDTO> getAllSubjects() {
        List<Subject> subjects = subjectRepository.findAll();
        return subjects.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SubjectResponseDTO createSubjectWithTopics(SubjectDTO subjectDTO, List<TopicDTO> topicsDTO) {
        // Check if subject already exists
        if (subjectRepository.existsBySubjectName(subjectDTO.getSubjectName())) {
            throw new RuntimeException("Subject with this name already exists");
        }

        // Create new Subject
        Subject subject = new Subject();
        subject.setSubjectName(subjectDTO.getSubjectName());
        subject.setDescription(subjectDTO.getDescription());

        // Create and add topics
        if (topicsDTO != null && !topicsDTO.isEmpty()) {
            for (TopicDTO topicDTO : topicsDTO) {
                Topic topic = new Topic();
                topic.setTopicName(topicDTO.getTopicName());
                topic.setDescription(topicDTO.getDescription());

                // Add topic to subject
                subject.addTopic(topic);
            }
        }

        // Save the subject (this will cascade and save topics as well)
        Subject savedSubject = subjectRepository.save(subject);

        // Convert to response DTO
        return mapToSubjectResponseDTO(savedSubject);
    }

    @Override
    public SubjectDTO updateSubject(Long subjectId, SubjectDTO subjectDTO) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new UserNotFoundException("Subject not found with id: " + subjectId));

        subject.setSubjectName(subjectDTO.getSubjectName());
        subject.setDescription(subjectDTO.getDescription());

        Subject updatedSubject = subjectRepository.save(subject);
        return mapToDTO(updatedSubject);
    }

    @Override
    public void deleteSubject(Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new UserNotFoundException("Subject not found with id: " + subjectId));
        subjectRepository.delete(subject);
    }

    private SubjectDTO mapToDTO(Subject subject) {
        SubjectDTO subjectDTO = new SubjectDTO();
        subjectDTO.setSubjectId(subject.getSubjectId());
        subjectDTO.setSubjectName(subject.getSubjectName());
        subjectDTO.setDescription(subject.getDescription());
        return subjectDTO;
    }
    private SubjectResponseDTO mapToSubjectResponseDTO(Subject subject) {
        // Null check for the subject
        if (subject == null) {
            return null;
        }

        // Initialize topics list
        List<TopicDTO> topics = new ArrayList<>();

        // Carefully convert topics to avoid circular references
        if (subject.getTopics() != null && !subject.getTopics().isEmpty()) {
            topics = subject.getTopics().stream()
                    .map(topic -> {
                        TopicDTO topicDTO = new TopicDTO();
                        topicDTO.setTopicId(topic.getTopicId());
                        topicDTO.setTopicName(topic.getTopicName());
                        topicDTO.setDescription(topic.getDescription());
                        topicDTO.setSubjectId(subject.getSubjectId());
                        topicDTO.setSubjectName(subject.getSubjectName());
                        return topicDTO;
                    })
                    .collect(Collectors.toList());
        }

        // Create and return SubjectResponseDTO
        return new SubjectResponseDTO(
                subject.getSubjectId(),
                subject.getSubjectName(),
                subject.getDescription(),
                topics
        );
    }

    // Existing method to map Topic to TopicDTO
    private TopicDTO mapTopicToDTO(Topic topic) {
        if (topic == null) {
            return null;
        }

        // Use a method to safely get subject details
        Long subjectId = null;
        String subjectName = null;

        // Explicitly check and load subject details
        if (topic.getSubject() != null) {
            subjectId = topic.getSubject().getSubjectId();
            subjectName = topic.getSubject().getSubjectName();
        }

        return new TopicDTO(
                topic.getTopicId(),
                topic.getTopicName(),
                topic.getDescription(),
                subjectId,
                subjectName
        );
    }
    private SubjectResponseDTO mapToResponseDTO(Subject subject) {
        SubjectResponseDTO responseDTO = new SubjectResponseDTO();
        responseDTO.setSubjectId(subject.getSubjectId());
        // Set other properties from subject to responseDTO
        // For example:
        // responseDTO.setName(subject.getName());
        return responseDTO;
    }
}
