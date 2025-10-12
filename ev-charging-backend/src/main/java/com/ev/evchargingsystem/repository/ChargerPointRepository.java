package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.ChargerPoint;
import com.ev.evchargingsystem.model.request.ChargerPointRequest;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChargerPointRepository extends JpaRepository<ChargerPoint, Integer> {
    ChargerPoint findChargerPointById(int id);

    List<ChargerPoint> findChargerPointsByStationId(int stationId);

    @Query("SELECT DISTINCT c.chargerCost.portType FROM ChargerPoint c WHERE c.station.id = :stationID")
    List<String> findPortTypesByStationID(@Param("stationID") int stationID);
}
