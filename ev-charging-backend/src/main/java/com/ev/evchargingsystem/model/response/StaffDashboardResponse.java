package com.ev.evchargingsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffDashboardResponse {
    private int stationId;
    private String stationName;
    private double revenueToday;
    private long customersToday;
    private long chargingSessionsToday;
    private double averageChargingTime;     // phút
    private String mostUsedChargerPoint;

}
