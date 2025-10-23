package com.ev.evchargingsystem.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AdminUpdateUserRequest {
    @NotEmpty(message = "Fullname không được để trống!")
    private String fullName;

    @Email(message = "Email không hợp lệ!")
    private String email;

    @Pattern(regexp = "^(0(3\\d|5\\d|7\\d|8\\d|9\\d)\\d{7})$", message = "Số điện thoại không hợp lệ!")
    private String phone;

    private String role;

    private Boolean active; // true = đang hoạt động, false = bị vô hiệu hóa
}
