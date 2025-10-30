package com.ev.evchargingsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Check;

@Entity
@Check(constraints = "membership_type IN ('MEMBER','GOLD')")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Membership {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int id;
    @NotNull
    private String membershipType;
    @NotNull
    private int point;
    @OneToOne
    @JoinColumn(name="user_id", referencedColumnName = "id")
    private User user;
}
