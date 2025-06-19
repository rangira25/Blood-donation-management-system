package com.rangira.blooddonation.service;

import com.rangira.blooddonation.model.BloodDonation;
import com.rangira.blooddonation.model.User;
import com.rangira.blooddonation.repository.BloodDonationRepository;
import com.rangira.blooddonation.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BloodDonationService {

    @Autowired
    private BloodDonationRepository bloodDonationRepository;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(BloodDonationService.class);

    /**
     * Get all blood donations (Admin only)
     */
    public List<BloodDonation> getAllDonations() {
        logger.info("Fetching all blood donations");
        return bloodDonationRepository.findAll();
    }

    /**
     * Create a new blood donation
     */
    public BloodDonation createDonation(BloodDonation bloodDonation, String username) {
        logger.info("Creating new blood donation for user: {}", username);
        
        // Find and set the donor
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            bloodDonation.setDonor(userOpt.get());
        } else {
            throw new RuntimeException("User not found: " + username);
        }

        // Set default values
        if (bloodDonation.getDonationDate() == null) {
            bloodDonation.setDonationDate(LocalDate.now());
        }

        if (bloodDonation.getAvailable() == null) {
            bloodDonation.setAvailable(true);
        }

        // Validate blood type
        if (!isValidBloodType(bloodDonation.getBloodType())) {
            throw new IllegalArgumentException("Invalid blood type: " + bloodDonation.getBloodType());
        }

        // Validate amount
        if (bloodDonation.getAmount() <= 0) {
            throw new IllegalArgumentException("Donation amount must be positive");
        }

        BloodDonation savedDonation = bloodDonationRepository.save(bloodDonation);
        logger.info("Blood donation created successfully with ID: {}", savedDonation.getId());
        
        return savedDonation;
    }

    /**
     * Update an existing blood donation (Admin only)
     */
    public BloodDonation updateDonation(Long id, BloodDonation donationDetails) {
        logger.info("Updating blood donation with ID: {}", id);
        
        Optional<BloodDonation> donationOpt = bloodDonationRepository.findById(id);
        if (!donationOpt.isPresent()) {
            throw new RuntimeException("Donation not found with id: " + id);
        }

        BloodDonation donation = donationOpt.get();
        
        // Update fields
        if (donationDetails.getBloodType() != null) {
            if (!isValidBloodType(donationDetails.getBloodType())) {
                throw new IllegalArgumentException("Invalid blood type: " + donationDetails.getBloodType());
            }
            donation.setBloodType(donationDetails.getBloodType());
        }
        
        if (donationDetails.getAmount() != null) {
            if (donationDetails.getAmount() <= 0) {
                throw new IllegalArgumentException("Donation amount must be positive");
            }
            donation.setAmount(donationDetails.getAmount());
        }
        
        if (donationDetails.getDonationDate() != null) {
            donation.setDonationDate(donationDetails.getDonationDate());
        }
        
        if (donationDetails.getLocation() != null) {
            donation.setLocation(donationDetails.getLocation());
        }
        
        if (donationDetails.getNotes() != null) {
            donation.setNotes(donationDetails.getNotes());
        }
        
        if (donationDetails.getAvailable() != null) {
            donation.setAvailable(donationDetails.getAvailable());
        }

        // Update donor if provided
        if (donationDetails.getDonor() != null && donationDetails.getDonor().getId() != null) {
            Optional<User> donorOpt = userRepository.findById(donationDetails.getDonor().getId());
            if (donorOpt.isPresent()) {
                donation.setDonor(donorOpt.get());
            } else {
                throw new RuntimeException("Donor not found with id: " + donationDetails.getDonor().getId());
            }
        }

        BloodDonation updatedDonation = bloodDonationRepository.save(donation);
        logger.info("Blood donation updated successfully with ID: {}", updatedDonation.getId());
        
        return updatedDonation;
    }

    /**
     * Delete a blood donation (Admin only)
     */
    public void deleteDonation(Long id) {
        logger.info("Deleting blood donation with ID: {}", id);
        
        if (!bloodDonationRepository.existsById(id)) {
            throw new RuntimeException("Donation not found with id: " + id);
        }

        bloodDonationRepository.deleteById(id);
        logger.info("Blood donation deleted successfully with ID: {}", id);
    }

    /**
     * Get all available blood donations
     */
    public List<BloodDonation> getAvailableDonations() {
        logger.info("Fetching available blood donations");
        return bloodDonationRepository.findByAvailableTrue();
    }

    /**
     * Get donations by blood type
     */
    public List<BloodDonation> getDonationsByBloodType(String bloodType) {
        logger.info("Fetching donations for blood type: {}", bloodType);
        
        if (!isValidBloodType(bloodType)) {
            throw new IllegalArgumentException("Invalid blood type: " + bloodType);
        }
        
        return bloodDonationRepository.findByBloodTypeAndAvailableTrue(bloodType);
    }

    /**
     * Get donations by user
     */
    public List<BloodDonation> getDonationsByUser(String username) {
        logger.info("Fetching donations for user: {}", username);
        
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found: " + username);
        }

        return bloodDonationRepository.findByDonor(userOpt.get());
    }

    /**
     * Get donation by ID
     */
    public Optional<BloodDonation> getDonationById(Long id) {
        logger.info("Fetching donation with ID: {}", id);
        return bloodDonationRepository.findById(id);
    }

    /**
     * Mark donation as used
     */
    public BloodDonation markDonationAsUsed(Long id) {
        logger.info("Marking donation as used with ID: {}", id);
        
        Optional<BloodDonation> donationOpt = bloodDonationRepository.findById(id);
        if (!donationOpt.isPresent()) {
            throw new RuntimeException("Donation not found with id: " + id);
        }

        BloodDonation donation = donationOpt.get();
        donation.setAvailable(false);
        
        BloodDonation updatedDonation = bloodDonationRepository.save(donation);
        logger.info("Donation marked as used successfully with ID: {}", updatedDonation.getId());
        
        return updatedDonation;
    }

    /**
     * Get recent donations
     */
    public List<BloodDonation> getRecentDonations() {
        logger.info("Fetching recent donations");
        return bloodDonationRepository.findTop10ByOrderByDonationDateDesc();
    }

    /**
     * Get donation statistics by blood type
     */
    public long getAvailableDonationCountByBloodType(String bloodType) {
        logger.info("Getting available donation count for blood type: {}", bloodType);
        
        if (!isValidBloodType(bloodType)) {
            throw new IllegalArgumentException("Invalid blood type: " + bloodType);
        }
        
        return bloodDonationRepository.countByBloodTypeAndAvailableTrue(bloodType);
    }

    /**
     * Check if blood type is valid
     */
    private boolean isValidBloodType(String bloodType) {
        if (bloodType == null || bloodType.trim().isEmpty()) {
            return false;
        }
        
        String[] validBloodTypes = {"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"};
        for (String validType : validBloodTypes) {
            if (validType.equalsIgnoreCase(bloodType.trim())) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if user can donate (basic eligibility check)
     */
    public boolean canUserDonate(String username) {
        logger.info("Checking if user can donate: {}", username);
        
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return false;
        }

        User user = userOpt.get();
        
        // Basic checks
        if (user.getAge() != null && (user.getAge() < 18 || user.getAge() > 65)) {
            return false;
        }

        // Check last donation date (should be at least 56 days ago for whole blood)
        List<BloodDonation> userDonations = bloodDonationRepository.findByDonor(user);
        if (!userDonations.isEmpty()) {
            BloodDonation lastDonation = userDonations.get(0); // Assuming sorted by date desc
            if (lastDonation.getDonationDate() != null) {
                LocalDate lastDonationDate = lastDonation.getDonationDate();
                LocalDate eligibleDate = lastDonationDate.plusDays(56);
                if (LocalDate.now().isBefore(eligibleDate)) {
                    return false;
                }
            }
        }

        return true;
    }
}
