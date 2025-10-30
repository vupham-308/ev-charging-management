package com.ev.evchargingsystem.model.request;

import com.ev.evchargingsystem.entity.ChargingSession;
import com.ev.evchargingsystem.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.annotations.Check;

import java.util.Date;
@Data
@Check(constraints = "payment_method IN ('VNPAY')")

public class TopUpRequest {
    @NotNull
    private double totalAmount;
    @NotNull
    private String paymentMethod;
}
