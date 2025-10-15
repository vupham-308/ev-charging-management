package com.ev.evchargingsystem.model.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.annotations.Check;

@Check(constraints = "payment_method IN ('CASH', 'BALANCE'")
@Data
public class ChargingSessionRequest {
    @NotNull
    private int carId;
    @NotNull
    private int pointId;
    @NotNull
    private int goalBattery;
    @NotNull
    private String paymentMethod;
}
