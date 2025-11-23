package com.ev.evchargingsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Check;

@Entity
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
    @NotEmpty
    private String status;
    @Column(nullable = true)
    private Double powerRealTime;//công suất thực tế của trụ khi đang sạc

    @ManyToOne
    @JoinColumn(name="station_id", referencedColumnName = "id", nullable=false)
    private Station station;

    @ManyToOne
    @JoinColumn(name="charger_cost_id", referencedColumnName = "id", nullable = false)
    private ChargerCost chargerCost;
}
