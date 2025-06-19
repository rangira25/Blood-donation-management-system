package com.rangira.blooddonation.repository;

import com.rangira.blooddonation.model.BloodRequest;
import com.rangira.blooddonation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    
    // Find by blood type
    List<BloodRequest> findByBloodType(String bloodType);
    
    // Find by status
    List<BloodRequest> findByStatus(String status);
    
    // Find by urgency
    List<BloodRequest> findByUrgency(String urgency);
    
    // Find by urgency and status
    List<BloodRequest> findByUrgencyAndStatus(String urgency, String status);
    
    // Find by requester
    List<BloodRequest> findByRequester(User requester);
    
    // Find by requester and status
    List<BloodRequest> findByRequesterAndStatus(User requester, String status);
    
    // Find by hospital name
    List<BloodRequest> findByHospitalName(String hospitalName);
    
    // Find by needed by date (urgent requests)
    List<BloodRequest> findByNeededByDateBeforeAndStatus(LocalDate date, String status);
    
    // Find recent requests
    List<BloodRequest> findTop10ByOrderByRequestDateDesc();
    
    // Count by status
    long countByStatus(String status);
    
    // Count by urgency and status
    long countByUrgencyAndStatus(String urgency, String status);
}
