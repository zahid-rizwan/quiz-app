package com.adaptive.quiz.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "question_bank")
@ToString(exclude = {"options", "quizzes"}) // Exclude bidirectional fields
@EqualsAndHashCode(exclude = {"options", "quizzes"})
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "question_id")
    private Long questionId;

    @Column(nullable = false, length = 1000)
    private String questionText;

    @Column(length = 1000)
    private String explanation;

    @Column(nullable = false)
    private Integer difficultyLevel; // 1-5 scale

//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private QuestionType questionType;

    @ManyToOne
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<Option> options = new HashSet<>();
    @JsonBackReference
    @ManyToMany(mappedBy = "questions")
    private Set<Quiz> quizzes = new HashSet<>();
}
