//package com.adaptive.quiz.service;
//
//import com.adaptive.quiz.entity.User;
//import com.adaptive.quiz.model.JwtRequest;
//import com.adaptive.quiz.model.JwtResponse;
//
//import java.util.List;
//
////import java.util.List;
//
//public interface UserService {
//    User createUser(User user);
//
//    JwtResponse verify(JwtRequest jwtRequest);
////
//    List<User> getUsers();
//}
package com.adaptive.quiz.service;

import com.adaptive.quiz.entity.User;
import com.adaptive.quiz.model.JwtRequest;
import com.adaptive.quiz.model.JwtResponse;
import java.util.List;

public interface UserService {
    User createUser(User user);
    User createUserWithRole(User user, String roleName);
    JwtResponse verify(JwtRequest jwtRequest);
    List<User> getUsers();
    User addRoleToUser(int userId, String roleName);
    User removeRoleFromUser(int userId, String roleName);
}