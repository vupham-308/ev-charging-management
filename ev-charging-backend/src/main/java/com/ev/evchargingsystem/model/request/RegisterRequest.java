package com.ev.evchargingsystem.model.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotEmpty(message = "Password cannot be empty!")
    private String password;
    @NotEmpty(message = "Fullname cannot be empty!")
    @Column(columnDefinition = "NVARCHAR(100)")
    private String fullName;
    @Email
    @Column(unique = true)
    private String email;
    @Pattern(regexp = "^(0(3\\d|5\\d|7\\d|8\\d|9\\d)\\d{7})$", message = "Phone is invalid!")
    @Column(unique = true)
    private String phone;
}
