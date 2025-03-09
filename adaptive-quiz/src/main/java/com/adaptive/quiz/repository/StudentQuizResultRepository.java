package com.adaptive.quiz.repository;

import com.adaptive.quiz.entity.StudentQuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentQuizResultRepository extends JpaRepository<StudentQuizResult, Long> {

    List<StudentQuizResult> findByStudentStudentId(Long studentId);

    List<StudentQuizResult> findByQuizQuizId(Long quizId);

    @Query("SELECT COUNT(DISTINCT q.quizId) FROM StudentQuizResult r JOIN r.quiz q WHERE r.student.studentId = :studentId")
    Integer countUniqueQuizAttemptsByStudent(Long studentId);

    @Query("SELECT r FROM StudentQuizResult r WHERE r.student.studentId = :studentId AND r.quiz.quizId = :quizId")
    List<StudentQuizResult> findByStudentIdAndQuizId(Long studentId, Long quizId);
}

