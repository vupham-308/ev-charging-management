package com.ev.evchargingsystem.model.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProblemRequest {
    @NotEmpty(message = "Title cannot be empty!")
    @Column(columnDefinition = "NVARCHAR(200)")
    private String title;
    @NotEmpty (message = "Description cannot be empty!")
    @Column(columnDefinition = "NVARCHAR(3000)")
    private String description;
    private int chargerPoint;
}
