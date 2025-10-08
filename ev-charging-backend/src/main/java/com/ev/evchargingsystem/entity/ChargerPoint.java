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
    @NotEmpty (message = "Name cannot be empty!")
    @Column(columnDefinition = "NVARCHAR(30)")
    private String name;
    @NotNull
    private int capacity;
    @NotEmpty
    private String status;

    @ManyToOne
    @JoinColumn(name="station_id", referencedColumnName = "id", nullable=false)
    private Station station;

    @ManyToOne
    @JoinColumn(name="port_type", referencedColumnName = "port_type", nullable = false)
    private ChargerCost chargerCost;
}
