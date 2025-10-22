package com.ev.evchargingsystem.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class LoginRequest {

    @NotEmpty(message = "Email không được để trống!")
    @Email(message = "Email không hợp lệ!")
    private String email;


    @NotEmpty(message = "Mật khẩu không được để trống!")
    private String password;
}
