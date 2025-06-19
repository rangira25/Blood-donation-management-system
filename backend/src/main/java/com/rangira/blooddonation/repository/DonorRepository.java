package com.rangira.blooddonation.repository;


import com.rangira.blooddonation.model.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonorRepository extends JpaRepository<User, Long> {
    List<User> findByRole(String role); 
    // You can add custom query methods here if needed
}
