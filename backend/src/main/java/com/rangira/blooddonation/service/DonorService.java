package com.rangira.blooddonation.service;

import com.rangira.blooddonation.model.User;
import com.rangira.blooddonation.repository.DonorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DonorService {

    private final DonorRepository donorRepository;

    // Create a new donor (user with role DONOR)
    public User addDonor(User donor) {
        donor.setRole("DONOR"); // Set role to DONOR
        return donorRepository.save(donor);
    }

    // Get all users with role DONOR
    public List<User> getAllDonors() {
        return donorRepository.findByRole("DONOR");
    }

    public User getDonorById(Long id) {
        return donorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found"));
    }

    public User updateDonor(Long id, User donorDetails) {
        User donor = getDonorById(id);
        donor.setUsername(donorDetails.getUsername());
        donor.setEmail(donorDetails.getEmail());
        donor.setPassword(donorDetails.getPassword()); // Only if you're not using hashing
        // You can add more fields like contact info if added to User model
        return donorRepository.save(donor);
    }

    public void deleteDonor(Long id) {
        donorRepository.deleteById(id);
    }
}
