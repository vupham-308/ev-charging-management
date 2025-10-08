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
    @NotEmpty
    @Column(name="port_type")
    private String portType;
    @NotNull
    private float cost;
}
