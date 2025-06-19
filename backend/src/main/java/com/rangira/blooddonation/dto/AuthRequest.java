package com.rangira.blooddonation.dto;

public class AuthRequest {
    private String username;
    private String email;
    private String password;
    private String role;
    private String bloodType;
    private String location;

    // Getters
    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }

    public String getBloodType() {
        return bloodType;
    }

    public String getLocation() {
        return location;
    }

    // Setters
    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
