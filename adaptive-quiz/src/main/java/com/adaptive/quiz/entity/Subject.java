package com.adaptive.quiz.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "subjects")
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long subjectId;

    @Column(nullable = false, unique = true)
    private String subjectName;

    @Column(length = 500)
    private String description;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL,fetch = FetchType.LAZY,
            orphanRemoval = true)
    private Set<Topic> topics = new HashSet<>();
    public void addTopic(Topic topic) {
        if (topic != null) {
            this.topics.add(topic);
            topic.setSubject(this);
        }
    }

    public void removeTopic(Topic topic) {
        if (topic != null) {
            this.topics.remove(topic);
            topic.setSubject(null);
        }
    }
}