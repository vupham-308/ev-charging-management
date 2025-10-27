package com.ev.evchargingsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StationDetailResponse {
    //dashboard chi tiết trạm sạc của Admin
    private int id;
    private String name;
    private String address;
    private String phone;
    private String email;
    private String status;

    private int totalChargers;
    private int availableChargers;
    private int occupiedChargers;
    private int reservedChargers;
    private int outOfServiceChargers;
}
