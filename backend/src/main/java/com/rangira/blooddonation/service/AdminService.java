package com.rangira.blooddonation.service;

import com.rangira.blooddonation.repository.AppointmentRepository;
import com.rangira.blooddonation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public long countUsers() {
        return userRepository.count();
    }

    public long countAppointments() {
        return appointmentRepository.count();
    }

    public long countAppointmentsByStatus(String status) {
        return appointmentRepository.countByStatus(status);
    }
}
