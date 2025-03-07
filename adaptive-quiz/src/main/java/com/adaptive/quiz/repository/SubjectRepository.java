package com.adaptive.quiz.repository;

import com.adaptive.quiz.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findBySubjectName(String subjectName);
    boolean existsBySubjectName(String subjectName);
    @Query("SELECT s FROM Subject s LEFT JOIN FETCH s.topics WHERE s.subjectId = :subjectId")
    Optional<Subject> findByIdWithTopics(@Param("subjectId") Long subjectId);
    @Query("SELECT DISTINCT s FROM Subject s LEFT JOIN FETCH s.topics")
    List<Subject> findAllWithTopicsFetchJoin();
}