package com.ev.evchargingsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Check;

@Entity
@Table(name = "carBranch")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Check(constraints = "port_type IN ('AC', 'CCS', 'CHAdeMO')")
public class CarBranch {
        @Id
        @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
        private int id;

        @Column(nullable = false, length = 20)
        private String brand;

        @NotNull
        private double batteryCapacity;//kwh

    @Column(name="port_type")
    @NotEmpty
    private String portType;

    @Column(nullable = false)
    private boolean active = true;

}
