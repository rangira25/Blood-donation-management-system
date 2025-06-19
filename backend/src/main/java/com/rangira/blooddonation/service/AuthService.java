package com.rangira.blooddonation.service;

import com.rangira.blooddonation.dto.LoginRequest;
import com.rangira.blooddonation.dto.RegisterRequest;
import com.rangira.blooddonation.model.User;
import com.rangira.blooddonation.repository.UserRepository;
import com.rangira.blooddonation.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public void register(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());  // <- NEW
        user.setContact(request.getContact());  // <- NEW
        user.setAge(request.getAge());         // <- NEW
        user.setBloodType(request.getBloodType()); // <- NEW
    
        userRepository.save(user);
    
        emailService.sendEmail(user.getEmail(), "Welcome to Blood Donation System",
                "Thank you for registering. You can now log in.");
    }
    

    public String authenticate(LoginRequest request) {
        // First authenticate credentials
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
    
        // Now fetch the User entity from the DB
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    
        // Generate token with user info
        return jwtUtil.generateToken(user);
    }
    
}
