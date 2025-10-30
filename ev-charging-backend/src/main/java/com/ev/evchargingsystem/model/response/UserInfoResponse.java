package com.ev.evchargingsystem.model.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoResponse {
    private int id;
    private String fullName;
    private String phone;
    private String email;
    private String role;
}