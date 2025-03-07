package com.adaptive.quiz.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "teachers")
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long teacherId;

    @Column(nullable = false)
    private String name;
    @Column(unique = true,nullable = false)
    private  int userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column
    private String password;

    private String specialization;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
    private Set<Quiz> quizzes = new HashSet<>();
}