package com.ev.evchargingsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import org.hibernate.annotations.Check;

@Entity
@Check(constraints = "port_type IN ('AC', 'CCS', 'CHAdeMO') AND status IN ('AVAILABLE', 'OCCUPIED', 'OUT_OF_SERVICE')")
@Table(name="charger_points")
public class ChargerPoint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @NotEmpty
    private int capacity;
    @NotEmpty
    private String portType;
    @NotEmpty
    private int speed;
    @NotEmpty
    private float cost;
    @NotEmpty
    private String status;

    @ManyToOne
    @JoinColumn(name="station_id", referencedColumnName = "id")
    private Station station;
}
