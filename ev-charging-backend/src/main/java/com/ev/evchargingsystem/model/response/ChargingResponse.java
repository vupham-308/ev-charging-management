package com.ev.evchargingsystem.model.response;

import com.ev.evchargingsystem.entity.Car;
import com.ev.evchargingsystem.entity.ChargerPoint;
import com.ev.evchargingsystem.entity.Station;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChargingResponse {
    private int id;
    private ChargerPoint point;
    private Car car;
    private String paymentMethod;
    private String status;
    private int minute;
    private double fee;
    private int initBattery;
    private int goalBattery;
    private Date date;
}
