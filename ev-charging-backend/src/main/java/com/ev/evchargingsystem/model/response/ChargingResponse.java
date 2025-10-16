package com.ev.evchargingsystem.model.response;

import com.ev.evchargingsystem.entity.ChargerPoint;
import com.ev.evchargingsystem.entity.Station;
import lombok.Data;

@Data
public class ChargingResponse {
    private ChargerPoint point;
    private String carName;
    private String paymentMethod;
    private int minute;
    private double fee;
    private int initBattery;
    private int goalBattery;
}
