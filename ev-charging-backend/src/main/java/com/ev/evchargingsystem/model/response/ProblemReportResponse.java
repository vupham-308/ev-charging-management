package com.ev.evchargingsystem.model.response;

import com.ev.evchargingsystem.entity.ChargerPoint;
import com.ev.evchargingsystem.entity.Staff;
import com.ev.evchargingsystem.entity.Station;
import com.ev.evchargingsystem.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProblemReportResponse {
    private int id;
    private String title;
    private String description;
    private String status;
    private Date createdAt;
    private Date solvedAt;
    private String response;
    private Station station;
}
