package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    List<Reservation> findByUserId(int userId);
}
