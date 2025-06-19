package com.rangira.blooddonation.controller;

import com.rangira.blooddonation.dto.ResetPasswordRequest;
import com.rangira.blooddonation.model.User;
import com.rangira.blooddonation.service.EmailService;
import com.rangira.blooddonation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody ResetPasswordRequest request) {
        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email not found"));

        String token = UUID.randomUUID().toString();
        // Ideally save token in DB with expiration time (for simplicity skipping now)

        String resetLink = "http://your-frontend-domain/reset-password?token=" + token;

        emailService.sendEmail(
                user.getEmail(),
                "Password Reset Request",
                "Click this link to reset your password: " + resetLink
        );

        return "Password reset link sent to your email.";
    }
}
