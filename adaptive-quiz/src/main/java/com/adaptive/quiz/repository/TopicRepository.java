package com.adaptive.quiz.repository;

import com.adaptive.quiz.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findBySubjectSubjectId(Long subjectId);
    Optional<Topic> findByTopicNameAndSubjectSubjectId(String topicName, Long subjectId);
}
