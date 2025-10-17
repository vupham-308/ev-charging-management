package com.ev.evchargingsystem.model.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CarCreateRequest {
    @NotEmpty(message = "Brand cannot be empty!")
    private String brand;

    @NotEmpty(message = "Color cannot be empty!")
    private String color;

    @NotNull(message = "licensePlate cannot be empty!")
    @Pattern(regexp = "^\\d{2}[A-Z]-\\d{4,5}$", message = "Invalid license plate format. Example: 51F-12345")
    private String licensePlate;
}
