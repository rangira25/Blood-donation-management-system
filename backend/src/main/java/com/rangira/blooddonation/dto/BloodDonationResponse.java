package com.rangira.blooddonation.dto;

public class BloodDonationResponse {
    private Long id;
    private String donorName;
    private String bloodType;
    private String location;
    private String donationDate;

    // ✅ Default Constructor
    public BloodDonationResponse() {
    }

    // ✅ Parameterized Constructor
    public BloodDonationResponse(Long id, String donorName, String bloodType, String location, String donationDate) {
        this.id = id;
        this.donorName = donorName;
        this.bloodType = bloodType;
        this.location = location;
        this.donationDate = donationDate;
    }

    // ✅ Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDonorName() {
        return donorName;
    }

    public void setDonorName(String donorName) {
        this.donorName = donorName;
    }

    public String getBloodType() {
        return bloodType;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDonationDate() {
        return donationDate;
    }

    public void setDonationDate(String donationDate) {
        this.donationDate = donationDate;
    }
}
