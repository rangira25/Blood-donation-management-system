package com.rangira.blooddonation.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "requests")
public class BloodRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bloodType;
    private int amount;
    private String urgency;
    private String requesterName;
    private String hospitalName;
    private String reason;
    private LocalDate neededByDate;
    private LocalDate requestDate;
    private String status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User requester;  // Matches the controller code
}
