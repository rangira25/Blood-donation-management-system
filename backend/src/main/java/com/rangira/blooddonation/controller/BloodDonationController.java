package com.rangira.blooddonation.controller;

import com.rangira.blooddonation.model.BloodDonation;
import com.rangira.blooddonation.service.BloodDonationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

import java.util.Map;


@RestController
@RequestMapping("/api/donations")
@Validated
@CrossOrigin(origins = "*")
public class BloodDonationController {

    @Autowired
    private BloodDonationService bloodDonationService;

    private static final Logger logger = LoggerFactory.getLogger(BloodDonationController.class);

    // Get all donations (Admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAllDonations() {
        try {
            List<BloodDonation> donations = bloodDonationService.getAllDonations();
            return ResponseEntity.ok(donations);
        } catch (Exception e) {
            logger.error("Error fetching all donations", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching donations: " + e.getMessage());
        }
    }

    // Create new donation
    @PreAuthorize("hasRole('USER') or hasRole('DONOR') or hasRole('ADMIN')")
    @PostMapping("/donate")
    public ResponseEntity<?> donateBlood(@Valid @RequestBody BloodDonation bloodDonation) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            BloodDonation savedDonation = bloodDonationService.createDonation(bloodDonation, username);
            return ResponseEntity.ok(savedDonation);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error in donation", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Validation error: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error saving blood donation", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing donation request: " + e.getMessage());
        }
    }

    // Update donation (Admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDonation(@PathVariable Long id, @Valid @RequestBody BloodDonation donationDetails) {
        try {
            BloodDonation updatedDonation = bloodDonationService.updateDonation(id, donationDetails);
            return ResponseEntity.ok(updatedDonation);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error in donation update", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Validation error: " + e.getMessage());
        } catch (RuntimeException e) {
            logger.error("Error updating donation", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error updating donation", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating donation: " + e.getMessage());
        }
    }

    // Delete donation (Admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDonation(@PathVariable Long id) {
        try {
            bloodDonationService.deleteDonation(id);
            return ResponseEntity.ok("Donation deleted successfully");
        } catch (RuntimeException e) {
            logger.error("Error deleting donation", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error deleting donation", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting donation: " + e.getMessage());
        }
    }

    // Get available donations
    @PreAuthorize("hasRole('USER') or hasRole('DONOR') or hasRole('ADMIN')")
    @GetMapping("/available")
    public ResponseEntity<?> getAvailableDonations() {
        try {
            List<BloodDonation> donations = bloodDonationService.getAvailableDonations();
            return ResponseEntity.ok(donations);
        } catch (Exception e) {
            logger.error("Error fetching available donations", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching available donations: " + e.getMessage());
        }
    }

    // Get donations by blood type
    @PreAuthorize("hasRole('USER') or hasRole('DONOR') or hasRole('ADMIN')")
    @GetMapping("/blood-type/{bloodType}")
    public ResponseEntity<?> getDonationsByBloodType(@PathVariable String bloodType) {
        try {
            List<BloodDonation> donations = bloodDonationService.getDonationsByBloodType(bloodType);
            return ResponseEntity.ok(donations);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid blood type", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid blood type: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error fetching donations by blood type", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching donations by blood type: " + e.getMessage());
        }
    }

    // Get my donations (for donors)
    @PreAuthorize("hasRole('DONOR') or hasRole('ADMIN')")
    @GetMapping("/my-donations")
    public ResponseEntity<?> getMyDonations() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            List<BloodDonation> donations = bloodDonationService.getDonationsByUser(username);
            return ResponseEntity.ok(donations);
        } catch (RuntimeException e) {
            logger.error("Error fetching user donations", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error fetching user donations", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching user donations: " + e.getMessage());
        }
    }

    // Mark donation as used (Admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/mark-used")
    public ResponseEntity<?> markDonationAsUsed(@PathVariable Long id) {
        try {
            BloodDonation updatedDonation = bloodDonationService.markDonationAsUsed(id);
            return ResponseEntity.ok(updatedDonation);
        } catch (RuntimeException e) {
            logger.error("Error marking donation as used", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error marking donation as used", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error marking donation as used: " + e.getMessage());
        }
    }

    // Get recent donations
    @PreAuthorize("hasRole('USER') or hasRole('DONOR') or hasRole('ADMIN')")
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentDonations() {
        try {
            List<BloodDonation> donations = bloodDonationService.getRecentDonations();
            return ResponseEntity.ok(donations);
        } catch (Exception e) {
            logger.error("Error fetching recent donations", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching recent donations: " + e.getMessage());
        }
    }

    // Check if user can donate
    @PreAuthorize("hasRole('USER') or hasRole('DONOR') or hasRole('ADMIN')")
    @GetMapping("/can-donate")
    public ResponseEntity<?> canUserDonate() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            boolean canDonate = bloodDonationService.canUserDonate(username);
            return ResponseEntity.ok(Map.of("canDonate", canDonate));
        } catch (Exception e) {
            logger.error("Error checking donation eligibility", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error checking donation eligibility: " + e.getMessage());
        }
    }
}
