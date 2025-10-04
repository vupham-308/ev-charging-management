package com.ev.evchargingsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.Constraint;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.Check;

import java.util.Date;

@Entity
@Check(constraints = "payment_method IN ('BALANCE', 'VNPAY') AND payment_type IN ('TOPUP', 'WITHDRAW') AND status IN ('PENDING', 'COMPLETED', 'FAILED')")
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int id;
    @NotNull
    private Date date;
    @NotNull
    private float totalAmount;
    @NotNull
    private String paymentMethod;
    @NotNull
    private String paymentType;
    @NotNull
    private String status;

    @ManyToOne
    @JoinColumn(name="user_id", referencedColumnName = "id")
    private User user;

    @OneToOne
    @JoinColumn(name="reservation_id", referencedColumnName = "id",nullable = true)
    private Reservation reservation;

    @OneToOne
    @JoinColumn(name="charging_session_id", referencedColumnName = "id")
    private ChargingSession chargingSession;
}
