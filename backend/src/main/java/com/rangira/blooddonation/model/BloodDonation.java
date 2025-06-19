package com.rangira.blooddonation.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "donations")
public class BloodDonation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bloodType;

    private Integer amount; // in pints

    private Boolean available; // changed from primitive to wrapper for null-safety

    private LocalDate donationDate;

    private String location;

    private String notes;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    private User donor; // Linked to user with role DONOR
}
