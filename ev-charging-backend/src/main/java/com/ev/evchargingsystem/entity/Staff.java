package com.ev.evchargingsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name="staffs")
public class Staff {
    @Id
    @NotNull
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private String id;
    @OneToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="staff_id", referencedColumnName = "id")
    private Station station;
}
