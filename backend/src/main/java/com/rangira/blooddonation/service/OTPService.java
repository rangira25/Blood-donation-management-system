package com.rangira.blooddonation.service;

import com.rangira.blooddonation.model.User;
import com.rangira.blooddonation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;


@Service
public class OTPService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public void generateAndSendOtp(User user) {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // 6-digit OTP
        user.setOtp(String.valueOf(otp));
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        
        userRepository.save(user);

        emailService.sendEmail(
                user.getEmail(),
                "Your OTP Code",
                "Your OTP code is: " + otp
        );
    }

    public boolean verifyOtp(User user, String otp) {
        if (user.getOtp() == null || user.getOtpExpiry() == null) {
            return false;
        }
        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            return false; // OTP expired
        }
        return user.getOtp().equals(otp);
    }
}
