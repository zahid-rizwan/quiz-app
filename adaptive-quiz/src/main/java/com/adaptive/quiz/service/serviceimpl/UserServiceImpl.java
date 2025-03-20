package com.adaptive.quiz.service.serviceimpl;

import com.adaptive.quiz.entity.*;
import com.adaptive.quiz.exception.InvalidCredentialsException;
import com.adaptive.quiz.exception.UserNotFoundException;
import com.adaptive.quiz.model.JwtRequest;
import com.adaptive.quiz.model.JwtResponse;
import com.adaptive.quiz.repository.StudentRepository;
import com.adaptive.quiz.repository.TeacherRepository;
import com.adaptive.quiz.repository.UserRepository;
import com.adaptive.quiz.service.RoleService;
import com.adaptive.quiz.service.TeacherService;
import com.adaptive.quiz.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleService roleService;

    @Autowired
    private StudentServiceImpl studentService;

    @Autowired
    private AuthenticationManager authenticationManager;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Autowired
    private JWTService jwtService;

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Override
    public User createUser(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public User createUserWithRole(User user, String roleName) {
        System.out.println("In role");
        user.setPassword(encoder.encode(user.getPassword()));
        Role role = roleService.findByName(roleName);
        if (role == null) {
            role = new Role(roleName);
            roleService.createRole(role);
        }
        user.addRole(role);

        User savedUser = userRepository.save(user);
        if (roleName.equals("STUDENT")) {
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
                if (principal instanceof UserPrincipal userPrincipal) {
                    User authenticatedUser = userPrincipal.getUser();

                    System.out.println("User:" + authenticatedUser);
                    System.out.println("Username:" + authenticatedUser.getName());
                    System.out.println("Authorities:" + authentication.getAuthorities());

                    String token = jwtService.generateToken(authenticatedUser.getEmail());

                    // Check user roles and return appropriate entity
                    boolean isStudent = authenticatedUser.getRoles().stream()
                            .anyMatch(role -> role.getName().equals("STUDENT"));
                    boolean isTeacher = authenticatedUser.getRoles().stream()
                            .anyMatch(role -> role.getName().equals("TEACHER"));

                    try {
                        if (isStudent) {
                            // Use JPQL query to avoid fetching associations
                            Student student = studentRepository.findByUserIdWithoutAssociations(authenticatedUser.getId());
                            if (student != null) {
                                return new JwtResponse(token, authenticatedUser, student);
                            }
                        } else if (isTeacher) {
                            System.out.println("in isTeacher");
                            // Use JPQL query to avoid fetching associations
                            Teacher teacher = teacherRepository.findByUserIdWithoutAssociations(authenticatedUser.getId());
                            if (teacher != null) {
                                return new JwtResponse(token, authenticatedUser, teacher);
                            }
                        }
                    } catch (Exception e) {
                        // Log the error but continue with basic response
                        System.err.println("Error fetching role-specific entity: " + e.getMessage());
                        e.printStackTrace();
                    }

                    // If we couldn't find the associated entity or user has no specific role
                    return new JwtResponse(token, authenticatedUser);
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace(); // Log the full stack trace for debugging
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

    // Method to handle OAuth2 user creation or retrieval
    public User createOrRetrieveUser(OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        User user = userRepository.findByEmail(email);

        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setName(oauth2User.getAttribute("name"));
            user.setPassword("N/A"); // No password for OAuth2 users
            user = createUserWithRole(user, "STUDENT"); // Default role
        }

        return user;
    }

    // Method to generate JWT token for OAuth2 users
    public JwtResponse generateJwtResponseForOAuth2User(OAuth2User oauth2User) {
        User user = createOrRetrieveUser(oauth2User);
        String token = jwtService.generateToken(user.getEmail());

        // Check user roles and return appropriate entity
        boolean isStudent = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("STUDENT"));
        boolean isTeacher = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("TEACHER"));

        try {
            if (isStudent) {
                Student student = studentRepository.findByUserIdWithoutAssociations(user.getId());
                if (student != null) {
                    return new JwtResponse(token, user, student);
                }
            } else if (isTeacher) {
                Teacher teacher = teacherRepository.findByUserIdWithoutAssociations(user.getId());
                if (teacher != null) {
                    return new JwtResponse(token, user, teacher);
                }
            }
        } catch (Exception e) {
            System.err.println("Error fetching role-specific entity: " + e.getMessage());
            e.printStackTrace();
        }

        // If we couldn't find the associated entity or user has no specific role
        return new JwtResponse(token, user);
    }
    @Override
    public Map<String, Object> getCurrentUserData(String email) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + email);
        }

        // Determine primary role
        String primaryRole = user.getRoles().stream()
                .map(Role::getName)
                .findFirst()
                .orElse("No role found");

        Map<String, Object> response = new HashMap<>();
        response.put("jwtToken", jwtService.generateToken(user.getEmail()));
        response.put("user", user);
        response.put("primaryRole", primaryRole);

        // Add student or teacher data if applicable
        if (primaryRole.equals("STUDENT")) {
            Student student = studentRepository.findByUserIdWithoutAssociations(user.getId());
            if (student != null) {
                response.put("student", student);
            }
        } else if (primaryRole.equals("TEACHER")) {
            Teacher teacher = teacherRepository.findByUserIdWithoutAssociations(user.getId());
            if (teacher != null) {
                response.put("teacher", teacher);
            }
        }

        return response;
    }
}