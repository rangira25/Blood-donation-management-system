package com.rangira.blooddonation.controller;

import com.rangira.blooddonation.model.User;
import com.rangira.blooddonation.service.DonorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")

@RestController
@RequestMapping("/api/donors")
@RequiredArgsConstructor
public class DonorController {

    private final DonorService donorService;

    @PostMapping
    public ResponseEntity<User> addDonor(@RequestBody User donor) {
        return ResponseEntity.ok(donorService.addDonor(donor));
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllDonors() {
        return ResponseEntity.ok(donorService.getAllDonors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getDonorById(@PathVariable Long id) {
        return ResponseEntity.ok(donorService.getDonorById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateDonor(@PathVariable Long id, @RequestBody User donor) {
        return ResponseEntity.ok(donorService.updateDonor(id, donor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDonor(@PathVariable Long id) {
        donorService.deleteDonor(id);
        return ResponseEntity.ok("Donor deleted successfully.");
    }
}
