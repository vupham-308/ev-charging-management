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

    @ManyToOne
    @JoinColumn(name="branch_id",referencedColumnName = "id", nullable=false)
    private CarBranch carBranch;

    @NotEmpty(message = "Màu xe không được để trống!")
    @Column(columnDefinition = "nvarchar(30)")
    private String color;

    @NotNull
    private double initBattery;//kWh

    @Column(unique = true)
    @NotNull(message = "Biển số xe không được để trống!")
    @Pattern(regexp = "^\\d{2}[A-Z]-\\d{4,5}$", message = "Invalid license plate format. Example: 51F-12345")
    private String licensePlate;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(nullable = false)
    private boolean active = true;

}
