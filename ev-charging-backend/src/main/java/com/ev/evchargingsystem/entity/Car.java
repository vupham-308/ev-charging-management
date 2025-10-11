package com.ev.evchargingsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cars")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Car {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int id;
    @NotEmpty(message = "Brand cannot be empty!")
    private String brand;
    @NotEmpty(message = "Color cannot be empty!")
    private String color;
    @NotNull
    private int initBattery;
    @Column(unique = true)
    @NotNull(message = "licensePlate cannot be empty!")
    @Pattern(regexp = "^\\d{2}[A-Z]-\\d{4,5}$", message = "Invalid license plate format. Example: 51F-12345")
    private String licensePlate;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
}
