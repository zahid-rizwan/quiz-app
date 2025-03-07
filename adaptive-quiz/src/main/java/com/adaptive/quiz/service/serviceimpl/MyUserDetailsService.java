package com.adaptive.quiz.service.serviceimpl;

import com.adaptive.quiz.entity.User;
import com.adaptive.quiz.entity.UserPrincipal;
import com.adaptive.quiz.exception.UserNotFoundException;
import com.adaptive.quiz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    @Autowired
    public MyUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UserNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserNotFoundException("User with username '" + email + "' not found.");
        }
        return new UserPrincipal(user);
    }

}
