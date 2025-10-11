package com.ev.evchargingsystem.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserUpdateRequest {
    @NotEmpty(message = "Fullname cannot be empty!")
    private String fullName;

    @Email
    private String email;

    @Pattern(regexp = "^(0(3\\d|5\\d|7\\d|8\\d|9\\d)\\d{7})$", message = "Phone is invalid!")
    private String phone;
}