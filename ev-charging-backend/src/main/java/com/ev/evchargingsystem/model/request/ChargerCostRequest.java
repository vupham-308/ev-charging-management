package com.ev.evchargingsystem.model.request;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Check;

@Check(constraints = "port_type IN ('AC', 'CCS', 'CHAdeMO')")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChargerCostRequest {
        @NotEmpty
        @Column(name="port_type")
        private String portType;
        @NotNull//kW
        private int power;
        @NotNull//cost ? kWh
        private double cost;

}
