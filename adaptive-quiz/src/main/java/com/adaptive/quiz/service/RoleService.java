package com.adaptive.quiz.service;

import com.adaptive.quiz.entity.Role;
import java.util.List;

public interface RoleService {
    Role createRole(Role role);
    Role findByName(String name);
    List<Role> getAllRoles();
}