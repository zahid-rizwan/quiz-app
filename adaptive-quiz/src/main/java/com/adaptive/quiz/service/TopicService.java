package com.adaptive.quiz.service;

import com.adaptive.quiz.dto.TopicDTO;

import java.util.List;

public interface TopicService {
    TopicDTO createTopic(TopicDTO topicDTO);
    TopicDTO getTopicById(Long topicId);
    List<TopicDTO> getAllTopics();
    List<TopicDTO> getTopicsBySubjectId(Long subjectId);
    TopicDTO updateTopic(Long topicId, TopicDTO topicDTO);
    void deleteTopic(Long topicId);
}
