package com.ev.evchargingsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int id;
    @NotEmpty
    private String password;
    @NotEmpty(message = "Fullname not empty!")
    private String fullName;
    @Email
    @Column(unique = true)
    private String email;
    @Pattern(regexp = "^(0(3\\d|5\\d|7\\d|8\\d|9\\d)\\d{7})$")
    @Column(unique = true)
    private String phone;
    @Column(columnDefinition = "VARCHAR(10) CHECK (role IN ('USER', 'ADMIN', 'STAFF'))")
    private String role;

}
