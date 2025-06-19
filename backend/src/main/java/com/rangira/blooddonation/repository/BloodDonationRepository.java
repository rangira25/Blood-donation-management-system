package com.rangira.blooddonation.repository;

import com.rangira.blooddonation.model.BloodDonation;
import com.rangira.blooddonation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodDonationRepository extends JpaRepository<BloodDonation, Long> {
    
    // Find available donations
    List<BloodDonation> findByAvailableTrue();
    
    // Find by blood type and availability
    List<BloodDonation> findByBloodTypeAndAvailableTrue(String bloodType);
    
    // Find by blood type
    List<BloodDonation> findByBloodType(String bloodType);
    
    // Find by donor
    List<BloodDonation> findByDonor(User donor);
    
    // Find by donor and availability
    List<BloodDonation> findByDonorAndAvailableTrue(User donor);
    
    // Count available donations by blood type
    long countByBloodTypeAndAvailableTrue(String bloodType);
    
    // Find recent donations (you can add date filtering later)
    List<BloodDonation> findTop10ByOrderByDonationDateDesc();
}
