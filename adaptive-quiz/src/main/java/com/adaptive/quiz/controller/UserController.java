//package com.adaptive.quiz.controller;
//
//import com.adaptive.quiz.entity.User;
//import com.adaptive.quiz.model.JwtRequest;
//import com.adaptive.quiz.JwtResponse;
//import com.adaptive.quiz.service.UserService;
//import jakarta.servlet.http.HttpServletRequest;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.web.csrf.CsrfToken;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.List;
//
//@RestController
//public class UserController {
//    @Autowired
//    private UserService userService;
//    @PostMapping("/register")
//    public ResponseEntity<User> createUser(@RequestBody User user){
//        System.out.println(user);
//        System.out.println("Hello");
//        User user1=userService.createUser(user);
//        return new ResponseEntity<>(user1, HttpStatus.CREATED);
//    }
//    @PostMapping("/login")
//    public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest jwtRequest){
//        System.out.println(jwtRequest);
////            return new ResponseEntity<>("success",HttpStatus.OK);
//        JwtResponse jwtResponse=userService.verify(jwtRequest);
//        System.out.println("token:"+jwtResponse.getJwtToken());
//        return new ResponseEntity<>(jwtResponse,HttpStatus.OK);
//    }
//    @GetMapping("/users")
//    public ResponseEntity<List<User>> getUsers(){
//        List<User> user =userService.getUsers();
//        System.out.println("hello");
//        for(User user1:user){
//            System.out.println(user1);
//        }
//        return new ResponseEntity<>(user,HttpStatus.OK);
//    }
////    @GetMapping("/users")
////    public String getUser(){
////        return "Welcome";
////    }
//    @GetMapping("/csrf")
//    public CsrfToken getCsrfToken(HttpServletRequest request){
//        return (CsrfToken) request.getAttribute("_csrf");
//    }
//}
package com.adaptive.quiz.controller;

import com.adaptive.quiz.entity.Role;
import com.adaptive.quiz.entity.User;
import com.adaptive.quiz.model.JwtRequest;
import com.adaptive.quiz.model.JwtResponse;
import com.adaptive.quiz.service.RoleService;
import com.adaptive.quiz.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @PostMapping("/register")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // Default role is STUDENT
        User user1 = userService.createUserWithRole(user, "STUDENT");
        return new ResponseEntity<>(user1, HttpStatus.CREATED);
    }

    @PostMapping("/register/teacher")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createTeacher(@RequestBody User user) {
        User teacher = userService.createUserWithRole(user, "TEACHER");
        return new ResponseEntity<>(teacher, HttpStatus.CREATED);
    }

    @PostMapping("/register/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createAdmin(@RequestBody User user) {
        User admin = userService.createUserWithRole(user, "ADMIN");
        return new ResponseEntity<>(admin, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest jwtRequest) {
        JwtResponse jwtResponse = userService.verify(jwtRequest);
        return new ResponseEntity<>(jwtResponse, HttpStatus.OK);
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = userService.getUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Role>> getRoles() {
        List<Role> roles = roleService.getAllRoles();
        return new ResponseEntity<>(roles, HttpStatus.OK);
    }

    @PostMapping("/users/{userId}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> addRoleToUser(@PathVariable int userId, @RequestBody Map<String, String> roleMap) {
        String roleName = roleMap.get("role");
        User user = userService.addRoleToUser(userId, roleName);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("/users/{userId}/roles/{roleName}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> removeRoleFromUser(@PathVariable int userId, @PathVariable String roleName) {
        User user = userService.removeRoleFromUser(userId, roleName);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    // Admin specific endpoint
    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> adminDashboard() {
        return new ResponseEntity<>("Admin Dashboard Access Granted", HttpStatus.OK);
    }

    // Teacher specific endpoint
    @GetMapping("/teacher/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<String> teacherDashboard() {
        return new ResponseEntity<>("Teacher Dashboard Access Granted", HttpStatus.OK);
    }

    // Student specific endpoint
    @GetMapping("/student/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<String> studentDashboard() {
        return new ResponseEntity<>("Student Dashboard Access Granted", HttpStatus.OK);
    }

    @GetMapping("/csrf")
    public CsrfToken getCsrfToken(HttpServletRequest request) {
        return (CsrfToken) request.getAttribute("_csrf");
    }
}