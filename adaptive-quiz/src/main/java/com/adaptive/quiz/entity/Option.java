package com.adaptive.quiz.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "options")
@ToString() // Exclude bidirectional fields
@EqualsAndHashCode()
public class Option {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long optionId;

    @Column(nullable = false, length = 500)
    private String optionText;

    @Column(name = "is_correct", columnDefinition = "BIT(1)")
    private boolean isCorrect;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    @JsonBackReference
    private Question question;
}
