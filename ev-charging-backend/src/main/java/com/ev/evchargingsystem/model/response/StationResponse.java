package com.ev.evchargingsystem.model.response;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StationResponse {
    @NotEmpty(message = "Name cannot be empty!")
    @Column(unique = true,columnDefinition = "Nvarchar(100)")
    private String name;
    @NotEmpty(message = "Address cannot be empty!")
    @Column(columnDefinition = "Nvarchar(200)")
    private String address;
    @NotNull
    private int pointChargerAvailable;
    private int pointChargerOutOfService;
    @NotNull
    private int pointChargerTotal;
    @NotNull
    private List<String> portType;
}
