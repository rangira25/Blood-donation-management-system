package com.rangira.blooddonation.controller;

import com.rangira.blooddonation.model.BloodRequest;
import com.rangira.blooddonation.service.BloodRequestService;
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
@RequestMapping("/api/requests")
@Validated
@CrossOrigin(origins = "*")
public class BloodRequestController {

    @Autowired
    private BloodRequestService bloodRequestService;

    private static final Logger logger = LoggerFactory.getLogger(BloodRequestController.class);

    // Get all requests (Admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAllRequests() {
        try {
            List<BloodRequest> requests = bloodRequestService.getAllRequests();
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            logger.error("Error fetching all requests", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching requests: " + e.getMessage());
        }
    }

    // Create new blood request
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping("/request")
    public ResponseEntity<?> requestBlood(@Valid @RequestBody BloodRequest bloodRequest) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            BloodRequest savedRequest = bloodRequestService.createRequest(bloodRequest, username);
            return ResponseEntity.ok(savedRequest);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error in request", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Validation error: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error saving blood request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing blood request: " + e.getMessage());
        }
    }

    // Update request (Admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRequest(@PathVariable Long id, @Valid @RequestBody BloodRequest requestDetails) {
        try {
            BloodRequest updatedRequest = bloodRequestService.updateRequest(id, requestDetails);
            return ResponseEntity.ok(updatedRequest);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error in request update", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Validation error: " + e.getMessage());
        } catch (RuntimeException e) {
            logger.error("Error updating request", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error updating request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating request: " + e.getMessage());
        }
    }

    // Delete request (Admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id) {
        try {
            bloodRequestService.deleteRequest(id);
            return ResponseEntity.ok("Request deleted successfully");
        } catch (RuntimeException e) {
            logger.error("Error deleting request", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error deleting request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting request: " + e.getMessage());
        }
    }

    // Fulfill request (Admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/fulfill")
    public ResponseEntity<?> fulfillRequest(@PathVariable Long id) {
        try {
            BloodRequest updatedRequest = bloodRequestService.fulfillRequest(id);
            return ResponseEntity.ok(updatedRequest);
        } catch (IllegalStateException e) {
            logger.error("Invalid state for fulfilling request", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid state: " + e.getMessage());
        } catch (RuntimeException e) {
            logger.error("Error fulfilling request", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error fulfilling request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fulfilling request: " + e.getMessage());
        }
    }

    // Cancel request
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelRequest(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            BloodRequest updatedRequest = bloodRequestService.cancelRequest(id, username);
            return ResponseEntity.ok(updatedRequest);
        } catch (IllegalStateException e) {
            logger.error("Invalid state for cancelling request", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid state: " + e.getMessage());
        } catch (RuntimeException e) {
            logger.error("Error cancelling request", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error cancelling request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error cancelling request: " + e.getMessage());
        }
    }

    // Get requests by blood type
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/blood-type/{bloodType}")
    public ResponseEntity<?> getRequestsByBloodType(@PathVariable String bloodType) {
        try {
            List<BloodRequest> requests = bloodRequestService.getRequestsByBloodType(bloodType);
            return ResponseEntity.ok(requests);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid blood type", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid blood type: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error fetching requests by blood type", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching requests by blood type: " + e.getMessage());
        }
    }

    // Get pending requests
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingRequests() {
        try {
            List<BloodRequest> requests = bloodRequestService.getPendingRequests();
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            logger.error("Error fetching pending requests", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching pending requests: " + e.getMessage());
        }
    }

    // Get urgent requests
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/urgent")
    public ResponseEntity<?> getUrgentRequests() {
        try {
            List<BloodRequest> requests = bloodRequestService.getUrgentRequests();
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            logger.error("Error fetching urgent requests", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching urgent requests: " + e.getMessage());
        }
    }

    // Get my requests
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/my-requests")
    public ResponseEntity<?> getMyRequests() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            List<BloodRequest> requests = bloodRequestService.getRequestsByUser(username);
            return ResponseEntity.ok(requests);
        } catch (RuntimeException e) {
            logger.error("Error fetching user requests", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error fetching user requests", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching user requests: " + e.getMessage());
        }
    }

    // Get recent requests
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentRequests() {
        try {
            List<BloodRequest> requests = bloodRequestService.getRecentRequests();
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            logger.error("Error fetching recent requests", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching recent requests: " + e.getMessage());
        }
    }

    // Get overdue requests
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/overdue")
    public ResponseEntity<?> getOverdueRequests() {
        try {
            List<BloodRequest> requests = bloodRequestService.getOverdueRequests();
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            logger.error("Error fetching overdue requests", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching overdue requests: " + e.getMessage());
        }
    }

    // Get request statistics
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/statistics")
    public ResponseEntity<?> getRequestStatistics() {
        try {
            Map<String, Object> stats = Map.of(
                "pendingCount", bloodRequestService.getRequestCountByStatus("Pending"),
                "fulfilledCount", bloodRequestService.getRequestCountByStatus("Fulfilled"),
                "cancelledCount", bloodRequestService.getRequestCountByStatus("Cancelled"),
                "urgentCount", bloodRequestService.getUrgentRequestCount()
            );
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error fetching request statistics", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching request statistics: " + e.getMessage());
        }
    }
}
