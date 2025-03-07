package com.adaptive.quiz.repository;

import com.adaptive.quiz.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByStudentStudentId(Long studentId);
    List<QuizAttempt> findByQuizQuizId(Long quizId);
    Optional<QuizAttempt> findByStudentStudentIdAndQuizQuizId(Long studentId, Long quizId);
}
