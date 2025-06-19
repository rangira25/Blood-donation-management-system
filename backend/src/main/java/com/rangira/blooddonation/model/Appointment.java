package com.rangira.blooddonation.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bloodType;
    private LocalDate appointmentDate;
    private String location;
    private String status; // Pending, Confirmed, Completed, Cancelled

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // Who booked this appointment (Donor)
}
