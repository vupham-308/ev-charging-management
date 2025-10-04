package com.ev.evchargingsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

@Entity
@Table(name="charging_sessions")
public class ChargingSession {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int id;
    @NotNull
    private Date startTime;
    @NotNull
    private Date endTime;
    @NotNull
    private int initBattery;
    @NotNull
    @Column(columnDefinition = "VARCHAR(10) CHECK (status IN ('ONGOING', 'COMPLETED', 'CANCELLED'))")
    private String status;

    @OneToOne
    @JoinColumn(name="charger_point_id", referencedColumnName = "id")
    private ChargerPoint chargerPoint;

    @OneToOne
    @JoinColumn(name="reservation_id", referencedColumnName = "id",nullable = true)
    private Reservation reservation;

    @OneToOne
    @JoinColumn(name="car_id", referencedColumnName = "id")
    private Car car;
}
