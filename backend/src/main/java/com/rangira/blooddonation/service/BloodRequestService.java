package com.rangira.blooddonation.service;

import com.rangira.blooddonation.model.BloodRequest;
import com.rangira.blooddonation.model.User;
import com.rangira.blooddonation.repository.BloodRequestRepository;
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
public class BloodRequestService {

    @Autowired
    private BloodRequestRepository bloodRequestRepository;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(BloodRequestService.class);

    /**
     * Get all blood requests (Admin only)
     */
    public List<BloodRequest> getAllRequests() {
        logger.info("Fetching all blood requests");
        return bloodRequestRepository.findAll();
    }

    /**
     * Create a new blood request
     */
    public BloodRequest createRequest(BloodRequest bloodRequest, String username) {
        logger.info("Creating new blood request for user: {}", username);
        
        // Find and set the requester
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            bloodRequest.setRequester(userOpt.get());
        } else {
            throw new RuntimeException("User not found: " + username);
        }

        // Set default values
        if (bloodRequest.getRequestDate() == null) {
            bloodRequest.setRequestDate(LocalDate.now());
        }

        if (bloodRequest.getStatus() == null || bloodRequest.getStatus().trim().isEmpty()) {
            bloodRequest.setStatus("Pending");
        }

        // Validate blood type
        if (!isValidBloodType(bloodRequest.getBloodType())) {
            throw new IllegalArgumentException("Invalid blood type: " + bloodRequest.getBloodType());
        }

        // Validate amount
        if (bloodRequest.getAmount() <= 0) {
            throw new IllegalArgumentException("Request amount must be positive");
        }

        // Validate urgency
        if (!isValidUrgency(bloodRequest.getUrgency())) {
            throw new IllegalArgumentException("Invalid urgency level: " + bloodRequest.getUrgency());
        }

        // Validate needed by date
        if (bloodRequest.getNeededByDate() != null && bloodRequest.getNeededByDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Needed by date cannot be in the past");
        }

        BloodRequest savedRequest = bloodRequestRepository.save(bloodRequest);
        logger.info("Blood request created successfully with ID: {}", savedRequest.getId());
        
        return savedRequest;
    }

    /**
     * Update an existing blood request (Admin only)
     */
    public BloodRequest updateRequest(Long id, BloodRequest requestDetails) {
        logger.info("Updating blood request with ID: {}", id);
        
        Optional<BloodRequest> requestOpt = bloodRequestRepository.findById(id);
        if (!requestOpt.isPresent()) {
            throw new RuntimeException("Request not found with id: " + id);
        }

        BloodRequest request = requestOpt.get();
        
        // Update fields
        if (requestDetails.getBloodType() != null) {
            if (!isValidBloodType(requestDetails.getBloodType())) {
                throw new IllegalArgumentException("Invalid blood type: " + requestDetails.getBloodType());
            }
            request.setBloodType(requestDetails.getBloodType());
        }
       if (requestDetails.getAmount() <= 0) {
    throw new IllegalArgumentException("Request amount must be positive");
}
request.setAmount(requestDetails.getAmount());

        
        if (requestDetails.getUrgency() != null) {
            if (!isValidUrgency(requestDetails.getUrgency())) {
                throw new IllegalArgumentException("Invalid urgency level: " + requestDetails.getUrgency());
            }
            request.setUrgency(requestDetails.getUrgency());
        }
        
        if (requestDetails.getRequesterName() != null) {
            request.setRequesterName(requestDetails.getRequesterName());
        }
        
        if (requestDetails.getHospitalName() != null) {
            request.setHospitalName(requestDetails.getHospitalName());
        }
        
        if (requestDetails.getReason() != null) {
            request.setReason(requestDetails.getReason());
        }
        
        if (requestDetails.getNeededByDate() != null) {
            if (requestDetails.getNeededByDate().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Needed by date cannot be in the past");
            }
            request.setNeededByDate(requestDetails.getNeededByDate());
        }
        
        if (requestDetails.getStatus() != null) {
            if (!isValidStatus(requestDetails.getStatus())) {
                throw new IllegalArgumentException("Invalid status: " + requestDetails.getStatus());
            }
            request.setStatus(requestDetails.getStatus());
        }

        BloodRequest updatedRequest = bloodRequestRepository.save(request);
        logger.info("Blood request updated successfully with ID: {}", updatedRequest.getId());
        
        return updatedRequest;
    }

    /**
     * Delete a blood request (Admin only)
     */
    public void deleteRequest(Long id) {
        logger.info("Deleting blood request with ID: {}", id);
        
        if (!bloodRequestRepository.existsById(id)) {
            throw new RuntimeException("Request not found with id: " + id);
        }

        bloodRequestRepository.deleteById(id);
        logger.info("Blood request deleted successfully with ID: {}", id);
    }

    /**
     * Fulfill a blood request (Admin only)
     */
    public BloodRequest fulfillRequest(Long id) {
        logger.info("Fulfilling blood request with ID: {}", id);
        
        Optional<BloodRequest> requestOpt = bloodRequestRepository.findById(id);
        if (!requestOpt.isPresent()) {
            throw new RuntimeException("Request not found with id: " + id);
        }

        BloodRequest request = requestOpt.get();
        
        if ("Fulfilled".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalStateException("Request is already fulfilled");
        }
        
        if ("Cancelled".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalStateException("Cannot fulfill a cancelled request");
        }
        
        request.setStatus("Fulfilled");
        
        BloodRequest updatedRequest = bloodRequestRepository.save(request);
        logger.info("Blood request fulfilled successfully with ID: {}", updatedRequest.getId());
        
        return updatedRequest;
    }

    /**
     * Cancel a blood request
     */
    public BloodRequest cancelRequest(Long id, String username) {
        logger.info("Cancelling blood request with ID: {} by user: {}", id, username);
        
        Optional<BloodRequest> requestOpt = bloodRequestRepository.findById(id);
        if (!requestOpt.isPresent()) {
            throw new RuntimeException("Request not found with id: " + id);
        }

        BloodRequest request = requestOpt.get();
        
        // Check if user owns the request or is admin
        if (request.getRequester() != null && !request.getRequester().getUsername().equals(username)) {
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (!userOpt.isPresent() || !"ADMIN".equals(userOpt.get().getRole())) {
                throw new RuntimeException("You can only cancel your own requests");
            }
        }
        
        if ("Fulfilled".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalStateException("Cannot cancel a fulfilled request");
        }
        
        if ("Cancelled".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalStateException("Request is already cancelled");
        }
        
        request.setStatus("Cancelled");
        
        BloodRequest updatedRequest = bloodRequestRepository.save(request);
        logger.info("Blood request cancelled successfully with ID: {}", updatedRequest.getId());
        
        return updatedRequest;
    }

    /**
     * Get requests by blood type
     */
    public List<BloodRequest> getRequestsByBloodType(String bloodType) {
        logger.info("Fetching requests for blood type: {}", bloodType);
        
        if (!isValidBloodType(bloodType)) {
            throw new IllegalArgumentException("Invalid blood type: " + bloodType);
        }
        
        return bloodRequestRepository.findByBloodType(bloodType);
    }

    /**
     * Get pending requests
     */
    public List<BloodRequest> getPendingRequests() {
        logger.info("Fetching pending requests");
        return bloodRequestRepository.findByStatus("Pending");
    }

    /**
     * Get urgent requests
     */
    public List<BloodRequest> getUrgentRequests() {
        logger.info("Fetching urgent requests");
        return bloodRequestRepository.findByUrgencyAndStatus("High", "Pending");
    }

    /**
     * Get requests by user
     */
    public List<BloodRequest> getRequestsByUser(String username) {
        logger.info("Fetching requests for user: {}", username);
        
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found: " + username);
        }

        return bloodRequestRepository.findByRequester(userOpt.get());
    }

    /**
     * Get request by ID
     */
    public Optional<BloodRequest> getRequestById(Long id) {
        logger.info("Fetching request with ID: {}", id);
        return bloodRequestRepository.findById(id);
    }

    /**
     * Get recent requests
     */
    public List<BloodRequest> getRecentRequests() {
        logger.info("Fetching recent requests");
        return bloodRequestRepository.findTop10ByOrderByRequestDateDesc();
    }

    /**
     * Get requests by hospital
     */
    public List<BloodRequest> getRequestsByHospital(String hospitalName) {
        logger.info("Fetching requests for hospital: {}", hospitalName);
        return bloodRequestRepository.findByHospitalName(hospitalName);
    }

    /**
     * Get overdue requests (needed by date has passed)
     */
    public List<BloodRequest> getOverdueRequests() {
        logger.info("Fetching overdue requests");
        return bloodRequestRepository.findByNeededByDateBeforeAndStatus(LocalDate.now(), "Pending");
    }

    /**
     * Get request statistics by status
     */
    public long getRequestCountByStatus(String status) {
        logger.info("Getting request count for status: {}", status);
        
        if (!isValidStatus(status)) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
        
        return bloodRequestRepository.countByStatus(status);
    }

    /**
     * Get urgent request count
     */
    public long getUrgentRequestCount() {
        logger.info("Getting urgent request count");
        return bloodRequestRepository.countByUrgencyAndStatus("High", "Pending");
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
     * Check if urgency level is valid
     */
    private boolean isValidUrgency(String urgency) {
        if (urgency == null || urgency.trim().isEmpty()) {
            return false;
        }
        
        String[] validUrgencies = {"Low", "Medium", "High"};
        for (String validUrgency : validUrgencies) {
            if (validUrgency.equalsIgnoreCase(urgency.trim())) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if status is valid
     */
    private boolean isValidStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            return false;
        }
        
        String[] validStatuses = {"Pending", "Fulfilled", "Cancelled"};
        for (String validStatus : validStatuses) {
            if (validStatus.equalsIgnoreCase(status.trim())) {
                return true;
            }
        }
        return false;
    }
}
