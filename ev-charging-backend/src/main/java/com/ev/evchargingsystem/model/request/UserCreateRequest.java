package com.ev.evchargingsystem.model.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserCreateRequest {
    private String fullName;
    @Email
    @Column(unique = true)
    private String email;
    @Pattern(regexp = "^(0(3\\d|5\\d|7\\d|8\\d|9\\d)\\d{7})$", message = "Số điện thoại không hợp lệ!")
    @Column(unique = true)
    private String phone;
    @NotNull
    private String role;
}
