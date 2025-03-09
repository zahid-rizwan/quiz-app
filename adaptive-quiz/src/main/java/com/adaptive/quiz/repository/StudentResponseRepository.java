package com.adaptive.quiz.repository;

import com.adaptive.quiz.entity.StudentResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentResponseRepository extends JpaRepository<StudentResponse, Long> {
    List<StudentResponse> findByQuizAttemptAttemptId(Long attemptId);

    @Query("SELECT COUNT(sr) FROM StudentResponse sr WHERE sr.quizAttempt.id = :attemptId AND sr.isCorrect = true")
    int countCorrectResponsesByAttemptId(@Param("attemptId") Long attemptId);
    Optional<StudentResponse> findByQuizAttemptAttemptIdAndQuestionQuestionId(Long attemptId, Long questionId);
}
