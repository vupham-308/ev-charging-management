package com.ev.evchargingsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Check;

import java.util.Date;

@Entity
@Check(constraints = "status IN ('ONGOING', 'COMPLETED', 'CANCELLED','WAITING_TO_PAY','PAID')")
@Check(constraints = "payment_method IN ('CASH', 'BALANCE')")
@Table(name="charging_sessions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChargingSession {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int id;
    @NotNull
    private Date startTime;
    @NotNull
    private Date endTime;
    @NotNull
    private String status;
    @NotNull
    private String paymentMethod;
    @NotNull
    private int goalBattery;

    @ManyToOne
    @JoinColumn(name="charger_point_id", referencedColumnName = "id")
    private ChargerPoint chargerPoint;

    @OneToOne
    @JoinColumn(name="reservation_id", referencedColumnName = "id",nullable = true)
    private Reservation reservation;

    @ManyToOne
    @JoinColumn(name="car_id", referencedColumnName = "id")
    private Car car;
}
