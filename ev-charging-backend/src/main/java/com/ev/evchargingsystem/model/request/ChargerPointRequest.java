package com.ev.evchargingsystem.model.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Check;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Check(constraints = "port_type IN ('AC', 'CCS', 'CHAdeMO') AND status IN ('AVAILABLE', 'OCCUPIED', 'OUT_OF_SERVICE')")
public class ChargerPointRequest {
    @NotEmpty (message = "Name cannot be empty!")
    @Column(columnDefinition = "NVARCHAR(30)")
    private String name;
    @NotEmpty
    private String portType;
    @NotEmpty
    private String status;
}
