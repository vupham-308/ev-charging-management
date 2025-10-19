package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.ReviewStation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewStationRepository extends JpaRepository<ReviewStation,Integer> {
    @Query("SELECT AVG(r.rating) FROM ReviewStation r WHERE r.station.id = :stationId")
    Double findAverageRatingByStationId(@Param("stationId") int stationId);

    List<ReviewStation> findByStationId(int stationId);
}
