package com.ev.evchargingsystem.model.response;

import com.ev.evchargingsystem.entity.ChargerPoint;
import com.ev.evchargingsystem.entity.Station;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChargingResponse {
    private ChargerPoint point;
    private String carName;
    private String paymentMethod;
    private int minute;
    private double fee;
    private int initBattery;
    private int goalBattery;
}
