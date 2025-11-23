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
    private int minute;//thời gian sạc ước tính
    private double fee;//chi phí ước tính
    private double energyDelivered;//kwh đã sạc cho xe
    private int initBattery;//pin lúc bắt đầu sạc (%)
    private int goalBattery;//mục tiêu pin mong muốn
    private int currentBattery;
    private Date startDate;
    private Date endDate;
    private long duration;//phút

    public ChargingResponse(int id, ChargerPoint point, Car car, String paymentMethod, String status, int minute, double fee, int initBattery, int goalBattery, int currentBattery, Date startDate, Date endDate) {
        this.id = id;
        this.point = point;
        this.car = car;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.minute = minute;
        this.fee = fee;
        this.initBattery = initBattery;
        this.goalBattery = goalBattery;
        this.currentBattery = currentBattery;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
