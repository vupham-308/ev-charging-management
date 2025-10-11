package com.ev.evchargingsystem.model.request;

import lombok.Data;

@Data
public class UpdatePasswordRequest {
    private String currentPassword;
    private String newPassword;
    private String confirmPassword;
}