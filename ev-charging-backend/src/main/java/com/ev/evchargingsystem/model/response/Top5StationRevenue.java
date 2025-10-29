package com.ev.evchargingsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Top5StationRevenue {
    private int stationId;
    private String stationName;
    private String address;
    private double totalRevenue;
}
