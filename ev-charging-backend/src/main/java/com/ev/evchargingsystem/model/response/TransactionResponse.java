package com.ev.evchargingsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionResponse {
    private int id;
    private double totalAmount;
    private String paymentMethod;
    private String paymentType;
    private String status;
    private Date date;
    private Integer chargingSessionId;
}