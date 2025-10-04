package com.ev.evchargingsystem.entity;

import jakarta.persistence.*;

@Entity
public class Membership {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int id;
    private String membershipType;
    private int point;
    @OneToOne
    @JoinColumn(name="user_id", referencedColumnName = "id")
    private User user;
}
