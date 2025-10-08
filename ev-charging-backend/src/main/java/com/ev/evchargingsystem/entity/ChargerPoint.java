package com.ev.evchargingsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Check;

@Entity
@Check(constraints = "port_type IN ('AC', 'CCS', 'CHAdeMO') AND status IN ('AVAILABLE', 'OCCUPIED', 'OUT_OF_SERVICE')")
@Table(name="charger_points")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChargerPoint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @NotNull
    @Column(columnDefinition = "NVARCHAR(30)")
    private String name;
    @NotEmpty
    private int capacity;
    @NotEmpty
    private String portType;
    @NotEmpty
    private float cost;
    @NotEmpty
    private String status;

    @ManyToOne
    @JoinColumn(name="station_id", referencedColumnName = "id", nullable=false)
    private Station station;
}