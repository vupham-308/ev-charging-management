package com.ev.evchargingsystem.model.request;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String email;
    private String newPassword;
    private String otp;
}
