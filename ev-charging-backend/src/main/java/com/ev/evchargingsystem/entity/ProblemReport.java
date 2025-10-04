package com.ev.evchargingsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.Check;

import java.util.Date;

@Entity
@Check(constraints = "status IN ('PENDING', 'IN_PROGRESS', 'SOLVED')")
@Table(name="problem_reports")
public class ProblemReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @NotEmpty
    private String title;
    @NotEmpty
    private String description;
    private String status;
    @NotNull
    private Date createdAt;
    @NotNull
    private Date solvedAt;

    @ManyToOne
    @JoinColumn(name="user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne
    @JoinColumn(name="station_id", referencedColumnName = "id")
    private Station station;
}
