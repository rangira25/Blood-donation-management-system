package com.rangira.blooddonation.dto;

public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String role; // Accept user role

    // Donor-specific fields
    private String bloodType;
    private int age;
    private String contact;

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getBloodType() { return bloodType; }
    public void setBloodType(String bloodType) { this.bloodType = bloodType; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    @Override
    public String toString() {
        return "RegisterRequest{" +
                "username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                ", bloodType='" + bloodType + '\'' +
                ", age=" + age +
                ", contact='" + contact + '\'' +
                '}';
    }
}
