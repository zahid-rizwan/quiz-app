package com.adaptive.quiz.controller;

import com.adaptive.quiz.model.JwtResponse;
import com.adaptive.quiz.service.serviceimpl.UserServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/oauth2")
public class OAuth2Controller {

    @Autowired
    private UserServiceImpl userService;

    @GetMapping("/login-success")
    public void loginSuccess(HttpServletResponse response, Authentication authentication) throws IOException {
        if (authentication == null) {
            response.sendRedirect("/login?error=authentication_failed");
            return;
        }

        try {
            OAuth2User oauth2User = null;
            if (authentication.getPrincipal() instanceof OAuth2User) {
                oauth2User = (OAuth2User) authentication.getPrincipal();
                JwtResponse jwtResponse = userService.generateJwtResponseForOAuth2User(oauth2User);

                // Redirect to frontend with token
                String redirectUrl = "http://localhost:3000/login?token=" + jwtResponse.getJwtToken();
                response.sendRedirect(redirectUrl);
            } else {
                response.sendRedirect("/login?error=principal_not_oauth2user");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("/login?error=processing_failed");
        }
    }
}