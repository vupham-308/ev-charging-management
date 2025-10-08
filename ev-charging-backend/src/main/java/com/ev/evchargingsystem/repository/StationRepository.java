package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StationRepository extends JpaRepository<Station, Integer> {
    Station findStationsById(int id);
}
