package com.ev.evchargingsystem.model.request;

import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Getter
@Setter
public class ReviewStationRequest {
    private int stationId;
    private String description;
    private int rating;
    private Date reviewDate;
}
