package com.adaptive.quiz.repository;

import com.adaptive.quiz.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByTeacherTeacherId(Long teacherId);
    List<Quiz> findBySubjectSubjectId(Long subjectId);
    List<Quiz> findByTopicTopicId(Long subjectId);
}
