package com.ev.evchargingsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name="review_stations")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewStation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @NotEmpty(message = "Description cannot be empty!")
    @Column(columnDefinition = "NVARCHAR(500)")
    private String description;
    @NotNull
    private int rating;
    @NotNull
    private Date reviewDate;

    @ManyToOne
    @JoinColumn(name="user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne
    @JoinColumn(name="station_id", referencedColumnName = "id")
    private Station station;
}
