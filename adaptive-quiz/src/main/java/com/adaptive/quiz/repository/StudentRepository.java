package com.adaptive.quiz.repository;

import com.adaptive.quiz.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student,Integer> {
    Optional<Student> findByEmail(String email);
    Optional<Student> findByUserId(int userId);
    boolean existsByEmail(String email);
    @Query("SELECT s FROM Student s WHERE s.userId = :userId")
    Student findByUserIdWithoutAssociations(@Param("userId") int userId);
}
