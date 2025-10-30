package com.ev.evchargingsystem.model.response;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CPointStatusResponseForStaff {
    private long available;
    private long occupied;
    private long reserved;
    private long outOfService;

    public CPointStatusResponseForStaff() {}
}
