package com.ev.evchargingsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.Constraint;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Check;

import java.util.Date;

@Entity
@Check(constraints = "payment_method IN ('CASH','BALANCE', 'VNPAY') AND payment_type IN ('TOPUP', 'WITHDRAW') AND status IN ('PENDING', 'COMPLETED', 'FAILED')")
@Table(name = "transactions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int id;
    @NotNull
    private Date date;
    @NotNull
    private double totalAmount;
    @NotNull
    private String paymentMethod;
    @NotNull
    private String paymentType;
    @NotNull
    private String status;

    @OneToOne
    @JoinColumn(name="charging_session_id", referencedColumnName = "id")
    private ChargingSession chargingSession;

    @ManyToOne
    @JoinColumn(name="user_id", referencedColumnName = "id")
    private User user;

    public Transaction(Date date, double totalAmount, String paymentMethod, String paymentType, String status, User user) {
        this.date = date;
        this.totalAmount = totalAmount;
        this.paymentMethod = paymentMethod;
        this.paymentType = paymentType;
        this.status = status;
        this.user = user;
    }
}
