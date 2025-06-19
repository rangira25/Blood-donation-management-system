package com.rangira.blooddonation.dto;

import com.rangira.blooddonation.validator.ValidEmail;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmailRequest {

    @ValidEmail
    private String to;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Message body is required")
    private String text;
}
