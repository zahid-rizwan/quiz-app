package com.adaptive.quiz.repository;

import com.adaptive.quiz.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByEmail(String email);
    boolean existsByEmail(String email);
    Teacher findByUserId(int userId);
    @Query("SELECT t FROM Teacher t WHERE t.userId = :userId")
    Teacher findByUserIdWithoutAssociations(@Param("userId") int userId);
}
