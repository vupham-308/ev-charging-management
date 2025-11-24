package com.ev.evchargingsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Check;

import java.util.List;

@Entity
@Check(constraints = "port_type IN ('AC', 'CCS', 'CHAdeMO')")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChargerCost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @NotNull(message = "Không được để trống loại cổng sạc")
    @Column(name="port_type")
    private String portType;
    @NotNull(message = "Không được để trống công suất")//kW
    private int power;
    @NotNull(message = "Không để trống giá sạc")  //cost ? kWh
    private double cost;

    public ChargerCost(String portType, int capacity, double cost) {
        this.portType = portType;
        this.power = capacity;
        this.cost = cost;
    }
}
