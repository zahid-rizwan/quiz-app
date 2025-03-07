package com.adaptive.quiz.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "student_responses")
public class StudentResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long responseId;

    @ManyToOne
    @JoinColumn(name = "attempt_id", nullable = false)
    private QuizAttempt quizAttempt;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne
    @JoinColumn(name = "selected_option_id")
    private Option selectedOption;

    @Column(length = 1000)
    private String textResponse; // For open-ended questions

    private boolean isCorrect;
}
