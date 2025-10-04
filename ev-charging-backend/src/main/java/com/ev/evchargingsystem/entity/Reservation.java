package com.ev.evchargingsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jdk.jfr.Name;
import org.hibernate.annotations.Check;

import java.util.Date;

@Entity
@Check(constraints = "status IN ('PENDING', 'CANCELLED', 'COMPLETED')")
@Table(name="reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int id;
    @NotNull
    private String status;
    @NotNull
    private Date startDate;
    @NotNull
    private Date endDate;

}
