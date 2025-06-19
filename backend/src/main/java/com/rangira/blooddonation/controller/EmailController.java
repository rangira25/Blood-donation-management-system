package com.rangira.blooddonation.controller;

import com.rangira.blooddonation.dto.EmailRequest;
import com.rangira.blooddonation.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@RequestBody @Valid EmailRequest request) {
        emailService.sendEmail(request.getTo(), request.getSubject(), request.getText());
        return ResponseEntity.ok("Email sent successfully to " + request.getTo());
    }
}
