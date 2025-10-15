package com.ev.evchargingsystem.model.response;

import lombok.Data;

@Data
public class ChargingResponse {
    private String stationName;
    private String point;
    private String carName;
    private String paymentMethod;
    private int minute;
    private double fee;
    private int initBattery;
    private int goalBattery;
}
