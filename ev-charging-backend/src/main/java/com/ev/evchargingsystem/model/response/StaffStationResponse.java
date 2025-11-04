package com.ev.evchargingsystem.model.response;

public class StaffStationResponse {
    private int staffId;
    private String staffName;
    private String stationName;

    public StaffStationResponse(int staffId, String staffName, String stationName) {
        this.staffId = staffId;
        this.staffName = staffName;
        this.stationName = stationName;
    }

    public int getStaffId() {
        return staffId;
    }

    public String getStaffName() {
        return staffName;
    }

    public String getStationName() {
        return stationName;
    }
}
