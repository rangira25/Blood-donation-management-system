package com.rangira.blooddonation.dto;

public class BloodRequestResponse {
    private Long id;
    private String requesterName;
    private String bloodType;
    private String urgencyLevel;

    // ✅ Default Constructor
    public BloodRequestResponse() {
    }

    // ✅ Parameterized Constructor
    public BloodRequestResponse(Long id, String requesterName, String bloodType, String urgencyLevel) {
        this.id = id;
        this.requesterName = requesterName;
        this.bloodType = bloodType;
        this.urgencyLevel = urgencyLevel;
    }

    // ✅ Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRequesterName() {
        return requesterName;
    }

    public void setRequesterName(String requesterName) {
        this.requesterName = requesterName;
    }

    public String getBloodType() {
        return bloodType;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }

    public String getUrgencyLevel() {
        return urgencyLevel;
    }

    public void setUrgencyLevel(String urgencyLevel) {
        this.urgencyLevel = urgencyLevel;
    }
}
