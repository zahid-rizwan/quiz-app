package com.adaptive.quiz.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private int id;
    private String name;
    private String email;
    private Set<String> roles;

    // Constructor to convert from User entity
    public UserDTO(com.adaptive.quiz.entity.User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        // Extract just the role names
        this.roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toSet());
    }
}
