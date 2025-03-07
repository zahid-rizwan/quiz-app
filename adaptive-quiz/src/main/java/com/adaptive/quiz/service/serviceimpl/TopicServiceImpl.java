package com.adaptive.quiz.service.serviceimpl;

import com.adaptive.quiz.dto.TopicDTO;
import com.adaptive.quiz.entity.Subject;
import com.adaptive.quiz.entity.Topic;
import com.adaptive.quiz.exception.UserNotFoundException;
import com.adaptive.quiz.repository.SubjectRepository;
import com.adaptive.quiz.repository.TopicRepository;
import com.adaptive.quiz.service.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TopicServiceImpl implements TopicService {

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Override
    public TopicDTO createTopic(TopicDTO topicDTO) {
        Subject subject = subjectRepository.findById(topicDTO.getSubjectId())
                .orElseThrow(() -> new UserNotFoundException("Subject not found with id: " + topicDTO.getSubjectId()));

        Topic topic = new Topic();
        topic.setTopicName(topicDTO.getTopicName());
        topic.setDescription(topicDTO.getDescription());
        topic.setSubject(subject);

        Topic savedTopic = topicRepository.save(topic);
        return mapToDTO(savedTopic);
    }

    @Override
    public TopicDTO getTopicById(Long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new UserNotFoundException("Topic not found with id: " + topicId));
        return mapToDTO(topic);
    }

    @Override
    public List<TopicDTO> getAllTopics() {
        List<Topic> topics = topicRepository.findAll();
        return topics.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<TopicDTO> getTopicsBySubjectId(Long subjectId) {
        List<Topic> topics = topicRepository.findBySubjectSubjectId(subjectId);
        return topics.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public TopicDTO updateTopic(Long topicId, TopicDTO topicDTO) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new UserNotFoundException("Topic not found with id: " + topicId));

        Subject subject = subjectRepository.findById(topicDTO.getSubjectId())
                .orElseThrow(() -> new UserNotFoundException("Subject not found with id: " + topicDTO.getSubjectId()));

        topic.setTopicName(topicDTO.getTopicName());
        topic.setDescription(topicDTO.getDescription());
        topic.setSubject(subject);

        Topic updatedTopic = topicRepository.save(topic);
        return mapToDTO(updatedTopic);
    }

    @Override
    public void deleteTopic(Long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new UserNotFoundException("Topic not found with id: " + topicId));
        topicRepository.delete(topic);
    }

    private TopicDTO mapToDTO(Topic topic) {
        TopicDTO topicDTO = new TopicDTO();
        topicDTO.setTopicId(topic.getTopicId());
        topicDTO.setTopicName(topic.getTopicName());
        topicDTO.setDescription(topic.getDescription());
        topicDTO.setSubjectId(topic.getSubject().getSubjectId());
        topicDTO.setSubjectName(topic.getSubject().getSubjectName());
        return topicDTO;
    }
}
