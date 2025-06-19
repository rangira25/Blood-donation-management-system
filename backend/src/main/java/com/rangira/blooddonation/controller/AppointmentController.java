package com.rangira.blooddonation.controller;

import com.rangira.blooddonation.model.Appointment;
import com.rangira.blooddonation.model.User;
import com.rangira.blooddonation.service.AppointmentService;
import com.rangira.blooddonation.service.UserService;

import org.springframework.data.domain.Page;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private UserService userService;

    // Normal user books an appointment
    @PostMapping("/book")
    public Appointment bookAppointment(@RequestBody Appointment appointment, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        appointment.setUser(user);
        return appointmentService.createAppointment(appointment);
    }

    // User can view their own appointments
    @GetMapping("/my")
public Page<Appointment> myAppointments(
        Authentication authentication,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    
    User user = userService.findByUsername(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
    
    Pageable pageable = PageRequest.of(page, size);
    return appointmentService.getAppointmentsByUser(user.getId(), pageable);
}

// Admin view all appointments (with pagination)
@GetMapping("/all")
public Page<Appointment> allAppointments(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    
    Pageable pageable = PageRequest.of(page, size);
    return appointmentService.getAllAppointments(pageable);
}
}
