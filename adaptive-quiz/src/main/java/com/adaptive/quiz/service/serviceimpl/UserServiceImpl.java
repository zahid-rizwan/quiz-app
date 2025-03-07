//package com.adaptive.quiz.service.serviceimpl;
//
//import com.adaptive.quiz.entity.User;
//import com.adaptive.quiz.entity.UserPrincipal;
//import com.adaptive.quiz.exception.InvalidCredentialsException;
//import com.adaptive.quiz.model.JwtRequest;
//import com.adaptive.quiz.model.JwtResponse;
//import com.adaptive.quiz.repository.UserRepository;
//import com.adaptive.quiz.service.UserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//
//public class UserServiceImpl  implements UserService {
//    @Autowired
//    UserRepository userRepository;
//    @Autowired
//    AuthenticationManager authenticationManager;
//    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
//    @Autowired
//    private JWTService jwtService;
//
//
//    @Override
//    public User createUser(User user) {
//            user.setPassword(encoder.encode(user.getPassword()));
//        return userRepository.save(user);
//    }
//
//    @Override
//    public JwtResponse verify(JwtRequest jwtRequest) {
//        try {
//            Authentication authentication = authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(jwtRequest.getEmail(), jwtRequest.getPassword())
//            );
//            if (authentication.isAuthenticated()) {
//                    Object principal = authentication.getPrincipal();
//                    if(principal instanceof UserPrincipal) {
//                        UserPrincipal userPrincipal = (UserPrincipal) principal;
//                        User authenticatedUser = userPrincipal.getUser();
//
//                        System.out.println("Username:" + authenticatedUser.getName());
//                        System.out.println("Authorities" + authenticatedUser.getId());
//
//                        String token = jwtService.generateToken(authenticatedUser.getName());
//                        JwtResponse jwtResponse= new JwtResponse(token , authenticatedUser);
//                        return jwtResponse;
//                    }
//            }
//
//        } catch (Exception ex) {
//            throw new InvalidCredentialsException("Invalid username or password.");
//        }
//        return null;
//    }
//
//
//    @Override
//    public List<User> getUsers() {
//        return userRepository.findAll();
//    }
//}
package com.adaptive.quiz.service.serviceimpl;

import com.adaptive.quiz.entity.Role;
import com.adaptive.quiz.entity.User;
import com.adaptive.quiz.entity.UserPrincipal;
import com.adaptive.quiz.exception.InvalidCredentialsException;
import com.adaptive.quiz.exception.UserNotFoundException;
import com.adaptive.quiz.model.JwtRequest;
import com.adaptive.quiz.model.JwtResponse;
import com.adaptive.quiz.repository.UserRepository;
import com.adaptive.quiz.service.RoleService;
import com.adaptive.quiz.service.TeacherService;
import com.adaptive.quiz.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleService roleService;
    @Autowired
    private  StudentServiceImpl studentService;

    @Autowired
    private AuthenticationManager authenticationManager;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Autowired
    private JWTService jwtService;
    @Autowired
    private TeacherService teacherService;

    @Override
    public User createUser(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public User createUserWithRole(User user, String roleName) {
        user.setPassword(encoder.encode(user.getPassword()));
        Role role = roleService.findByName(roleName);
        if (role == null) {
            role = new Role(roleName);
            roleService.createRole(role);
        }
        user.addRole(role);

        User savedUser =  userRepository.save(user);
        if(roleName.equals("STUDENT")){
            studentService.addStudent(savedUser);
        } else if (roleName.equals("TEACHER")) {
            teacherService.addTeacher(savedUser);
        }
        return savedUser;
    }

    @Override
    public JwtResponse verify(JwtRequest jwtRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(jwtRequest.getEmail(), jwtRequest.getPassword())
            );
            if (authentication.isAuthenticated()) {
                Object principal = authentication.getPrincipal();
                if(principal instanceof UserPrincipal userPrincipal) {
                    User authenticatedUser = userPrincipal.getUser();

                    System.out.println("User:" + authenticatedUser);
                    System.out.println("Username:" + authenticatedUser.getName());
                    System.out.println("Authorities:" + authentication.getAuthorities());

                    String token = jwtService.generateToken(authenticatedUser.getEmail());
                    return new JwtResponse(token, authenticatedUser);
                }
            }
        } catch (Exception ex) {
            throw new InvalidCredentialsException("Invalid username or password.");
        }
        return null;
    }

    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Override
    public User addRoleToUser(int userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        Role role = roleService.findByName(roleName);
        if (role == null) {
            role = new Role(roleName);
            roleService.createRole(role);
        }

        user.addRole(role);
        return userRepository.save(user);
    }

    @Override
    public User removeRoleFromUser(int userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        Role role = roleService.findByName(roleName);
        if (role != null) {
            user.getRoles().remove(role);
            return userRepository.save(user);
        }

        return user;
    }
}