package com.ev.evchargingsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StationStatsResponseForAdmin {
    private long totalStations;
    private long activeStations;
    private long inactiveStations;
}