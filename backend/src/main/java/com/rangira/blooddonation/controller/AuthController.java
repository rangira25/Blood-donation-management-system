package com.rangira.blooddonation.controller;

import com.rangira.blooddonation.dto.AuthRequest;
import com.rangira.blooddonation.dto.JwtResponse;
import com.rangira.blooddonation.dto.RegisterRequest;
import com.rangira.blooddonation.dto.ResetPasswordRequest;
import com.rangira.blooddonation.model.User;
import com.rangira.blooddonation.service.AuthService;
import com.rangira.blooddonation.service.OTPService;
import com.rangira.blooddonation.service.UserService;
import com.rangira.blooddonation.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    
   

    @Autowired
    private UserService userService;

    @Autowired
    private OTPService otpService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    // ✅ REGISTER endpoint
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        System.out.println("Received request: " + registerRequest.toString());

        Optional<User> existingUser = userService.findByUsername(registerRequest.getUsername());
        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists.");
        }

        Optional<User> existingEmail = userService.findByEmail(registerRequest.getEmail());
        if (existingEmail.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists.");
        }

        // Validate role or default to USER
        String role = registerRequest.getRole();
        if (role == null || (!role.equalsIgnoreCase("USER") &&
                             !role.equalsIgnoreCase("DONOR") &&
                             !role.equalsIgnoreCase("ADMIN"))) {
            role = "USER";
        }

        User newUser = new User();
        newUser.setUsername(registerRequest.getUsername());
        newUser.setEmail(registerRequest.getEmail());
        newUser.setPassword(userService.encodePassword(registerRequest.getPassword()));
        newUser.setRole(role.toUpperCase());

        // If role is donor, set donor-specific fields
        if (role.equalsIgnoreCase("DONOR")) {
            newUser.setAge(registerRequest.getAge());
            newUser.setContact(registerRequest.getContact());
            newUser.setBloodType(registerRequest.getBloodType());
        }

        userService.save(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully as " + newUser.getRole());
    }

    // ✅ Step 1: Login with username & password, send OTP
    @PostMapping("/login")
    public ResponseEntity<?> loginStep1(@RequestBody AuthRequest authRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

        User user = userService.findByUsername(authRequest.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        otpService.generateAndSendOtp(user);
        return ResponseEntity.ok("OTP sent to your email. Please verify to complete login.");
    }

    // ✅ Step 2: Verify OTP and return JWT token
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtpAndLogin(@RequestParam String username, @RequestParam String otp) {
        Optional<User> userOpt = userService.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOpt.get();

        if (!otpService.verifyOtp(user, otp)) {
            return ResponseEntity.badRequest().body("Invalid OTP.");
        }

        user.setOtp(null);
        user.setOtpExpiry(null);
        userService.save(user);

        String token = jwtUtil.generateToken(user);
       
        return ResponseEntity.ok(new JwtResponse(token, user.getUsername(), user.getRole()));

    }
 
    // ✅ Request password reset (send OTP)
    @PostMapping("/request-reset")
    public ResponseEntity<String> requestPasswordReset(@RequestParam String email) {
        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with that email not found.");
        }

        otpService.generateAndSendOtp(userOpt.get());
        return ResponseEntity.ok("OTP has been sent to your email.");
    }

    // ✅ Reset password using OTP
    @PostMapping("/reset-password")
public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
    Optional<User> userOpt = userService.findByEmail(request.getEmail());
    if (userOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with that email not found.");
    }

    User user = userOpt.get();

    if (!otpService.verifyOtp(user, request.getOtp())) {
        return ResponseEntity.badRequest().body("Invalid OTP.");
    }

    user.setPassword(userService.encodePassword(request.getNewPassword()));
    user.setOtp(null);
    user.setOtpExpiry(null);
    userService.save(user);

    return ResponseEntity.ok("Password reset successful.");
}}
