package com.ev.evchargingsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponse {
    private int id;
    private String userName;
    private int rating;
    private String description;
    private Date reviewDate;
}
