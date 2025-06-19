package com.rangira.blooddonation.repository;

import com.rangira.blooddonation.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserId(Long userId);
    long countByStatus(String status);
    Page<Appointment> findByUserId(Long userId, Pageable pageable);
    Page<Appointment> findAll(Pageable pageable);

}
