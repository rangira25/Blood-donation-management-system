package com.rangira.blooddonation.service;

import com.rangira.blooddonation.model.Appointment;
import com.rangira.blooddonation.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    public Appointment createAppointment(Appointment appointment) {
        // Always set status to Pending when booking
        appointment.setStatus("Pending");
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsByUser(Long userId) {
        return appointmentRepository.findByUserId(userId);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Page<Appointment> getAppointmentsByUser(Long userId, Pageable pageable) {
        return appointmentRepository.findByUserId(userId, pageable);
    }
    
    public Page<Appointment> getAllAppointments(Pageable pageable) {
        return appointmentRepository.findAll(pageable);
    }

    public Appointment updateAppointmentStatus(Long appointmentId, String status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }
}
