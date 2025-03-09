package com.adaptive.quiz.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "quizAttempts")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int studentId;
    private  String name;
    private  String university;
    @Column(length = 100)
    private String program;
    private  String email;
    @Column(unique = true,nullable = false)
    private  int userId;

    private int semester;

    @Column(length = 20)
    private String phone;

    @Column(columnDefinition = "TEXT")
    @JsonIgnore
    private String address;
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private Set<QuizAttempt> quizAttempts = new HashSet<>();

    @Column(columnDefinition = "TEXT")
    private String bio;
}