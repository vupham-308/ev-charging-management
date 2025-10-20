package com.ev.evchargingsystem.model.response;

import com.ev.evchargingsystem.entity.ChargingSession;
import com.ev.evchargingsystem.entity.Reservation;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class StaffChargerPointResponse {
    private int id;
    private String portType;
    private int capacity;
    private double price;
    private String status;
    private ChargingSession chargingSession;
    private Reservation reservation;

    //constructor cho AVAILABLE
    public StaffChargerPointResponse(int id, String portType, int capacity, double price, String status) {
        this.id = id;
        this.portType = portType;
        this.capacity = capacity;
        this.price = price;
        this.status = status;
    }

    //constructor cho ONGOING
    public StaffChargerPointResponse(int id, String portType, int capacity, double price, String status, ChargingSession chargingSession) {
        this.id = id;
        this.portType = portType;
        this.capacity = capacity;
        this.price = price;
        this.status = status;
        this.chargingSession = chargingSession;
    }

    //constructor cho Reservation
    public StaffChargerPointResponse(int id, String portType, int capacity, double price, String status, Reservation reservation) {
        this.id = id;
        this.portType = portType;
        this.capacity = capacity;
        this.price = price;
        this.status = status;
        this.reservation = reservation;
    }
}
