package com.ev.evchargingsystem.model.response;

import lombok.Data;

@Data
public class CarResponse {
    private Integer id;
    private String brand;
    private String color;
    private double initBattery;//init này tính bằng percent
    private String licensePlate;
}
