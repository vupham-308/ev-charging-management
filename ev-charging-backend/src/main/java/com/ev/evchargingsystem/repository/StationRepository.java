package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.Staff;
import com.ev.evchargingsystem.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StationRepository extends JpaRepository<Station, Integer> {
    Station findStationsById(int id);
    @Query("SELECT s FROM Station s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.address) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Station> searchStations(@Param("keyword") String keyword);

}
