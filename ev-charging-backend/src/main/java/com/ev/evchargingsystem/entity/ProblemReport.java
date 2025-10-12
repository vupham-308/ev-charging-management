package com.ev.evchargingsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Check;

import java.util.Date;
import java.util.List;

@Entity
@Check(constraints = "status IN ('PENDING', 'IN_PROGRESS', 'SOLVED')")
@Table(name="problem_reports")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProblemReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @NotEmpty(message = "Title cannot be empty!")
    @Column(columnDefinition = "NVARCHAR(200)")
    private String title;
    @NotEmpty(message = "Description cannot be empty!")
    @Column(columnDefinition = "NVARCHAR(3000)")
    private String description;
    @NotNull
    private String status;
    @NotNull
    private Date createdAt;
    private Date solvedAt;
    @Column(columnDefinition = "NVARCHAR(3000)")
    private String response;

    @ManyToMany
    @JoinTable(
            name = "ProblemReport_AssignedStaff",
            joinColumns = @JoinColumn(name = "problem_report_id"),
            inverseJoinColumns = @JoinColumn(name = "staff_id")
    )
    private List<Staff> assignedStaff;

    @ManyToOne
    @JoinColumn(name="user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne
    @JoinColumn(name="station_id", referencedColumnName = "id")
    private Station station;

}
