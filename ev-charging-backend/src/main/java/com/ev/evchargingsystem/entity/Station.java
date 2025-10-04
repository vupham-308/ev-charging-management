package com.ev.evchargingsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stations")
public class Station {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @NotEmpty
    @Column(nullable = false, unique = true,columnDefinition = "Nvarchar(100)")
    private String name;
    @NotEmpty
    @Column(nullable = false, columnDefinition = "Nvarchar(200)")
    private String address;
    @NotEmpty
    @Pattern(regexp = "^(0(3\\d|5\\d|7\\d|8\\d|9\\d)\\d{7})$")
    @Column(unique = true)
    private String phone;
    @Email
    @Column(unique = true)
    private String email;
}
