package com.adaptive.quiz.repository;

import com.adaptive.quiz.entity.Question;
import com.adaptive.quiz.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    //    List<Question> findByTopicId(Long topicId);
    List<Question> findByTopicTopicId(Long topicId);

    @Query("SELECT q FROM Question q WHERE q.topic.id = :topicId AND q.difficultyLevel = :difficultyLevel")
    List<Question> findByTopicIdAndDifficultyLevel(@Param("topicId") Long topicId, @Param("difficultyLevel") Integer difficultyLevel);

    @Query("SELECT q FROM Question q WHERE q.topic.subject.id = :subjectId")
    List<Question> findBySubjectId(@Param("subjectId") Long subjectId);
    List<Question> findByTopicInAndDifficultyLevel(List<Topic> topics, Integer difficultyLevel);
}
