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
    @NotEmpty (message = "Tên trụ sạc không được để trống!")
    @Column(columnDefinition = "NVARCHAR(30)")
    private String name;
    @NotEmpty
    private String status;

    @ManyToOne
    @JoinColumn(name="station_id", referencedColumnName = "id", nullable=false)
    private Station station;

    @ManyToOne
    @JoinColumn(name="charger_cost_id", referencedColumnName = "id", nullable = false)
    private ChargerCost chargerCost;
}
