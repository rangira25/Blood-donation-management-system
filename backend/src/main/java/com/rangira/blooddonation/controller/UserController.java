package com.rangira.blooddonation.controller;

import com.rangira.blooddonation.dto.JwtResponse;
import com.rangira.blooddonation.dto.LoginRequest;
import com.rangira.blooddonation.model.User;
import com.rangira.blooddonation.service.UserService;
import com.rangira.blooddonation.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;


import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> optionalUser = userService.findByUsername(loginRequest.getUsername());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }

        User user = optionalUser.get();

        // Validate password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }

        // Generate JWT
        String token = jwtUtil.generateToken(user); // ✅ pass the User object instead of username


       return ResponseEntity.ok(new JwtResponse(token, user.getUsername(), user.getRole()));

    }

    
@GetMapping("/search")
public ResponseEntity<?> searchUsers(
        @RequestParam String query,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {

    Page<User> result = userService.searchUsers(query, page, size);
    return ResponseEntity.ok(result);
}

@GetMapping
public ResponseEntity<Object> getAllUsers() {
    return ResponseEntity.ok(userService.getAllUsers());
}

@GetMapping("/{id}")
public ResponseEntity<Object> getUserById(@PathVariable Long id) {
    return ResponseEntity.ok(userService.getUserById(id));
}

@PutMapping("/{id}")
public ResponseEntity<Object> updateUser(@PathVariable Long id, @RequestBody User user) {
    return ResponseEntity.ok(userService.updateUser(id, user));
}

@DeleteMapping("/{id}")
public ResponseEntity<String> deleteUser(@PathVariable Long id) {
    userService.deleteUser(id);
    return ResponseEntity.ok("User deleted successfully");
}

}
