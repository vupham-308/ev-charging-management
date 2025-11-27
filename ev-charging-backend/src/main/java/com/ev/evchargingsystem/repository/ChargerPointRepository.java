package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.ChargerPoint;
import com.ev.evchargingsystem.model.request.ChargerPointRequest;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChargerPointRepository extends JpaRepository<ChargerPoint, Integer> {
    ChargerPoint findChargerPointById(int id);

    List<ChargerPoint> findChargerPointsByStationId(int stationId);

    @Query("SELECT DISTINCT c.chargerCost.portType FROM ChargerPoint c WHERE c.station.id = :stationID and c.active=true")
    List<String> findPortTypesByStationID(@Param("stationID") int stationID);

    @Query("SELECT COUNT(c) FROM ChargerPoint c WHERE c.active=true")
    long countTotalPoints();

    @Query("SELECT COUNT(c) FROM ChargerPoint c WHERE c.status = 'AVAILABLE' and c.active=true")
    long countAvailablePoints();

    @Query("SELECT COUNT(c) FROM ChargerPoint c WHERE c.status = 'OCCUPIED' and c.active=true")
    long countOccupiedPoints();

    List<ChargerPoint> findByStationId(int stationId);

    // Lấy trụ sạc theo trạm + trạng thái (nếu cần lọc)
    List<ChargerPoint> findByStationIdAndStatus(int stationId, String status);

    //tất cả trụ sạc của trạm
    @Query("SELECT COUNT(cp) FROM ChargerPoint cp WHERE cp.station.id = :stationId and cp.active=true")
    int countTotalByStationId(@Param("stationId") int stationId);

    //trụ sạc AVAILABLE của trạm
    @Query("SELECT COUNT(cp) FROM ChargerPoint cp WHERE cp.station.id = :stationId AND cp.status = 'AVAILABLE' and cp.active=true")
    int countAvailableByStationId(@Param("stationId") int stationId);

    @Query("SELECT COUNT(cp) FROM ChargerPoint cp WHERE cp.station.id = :stationId AND cp.status = 'OCCUPIED' and cp.active=true")
    int countOccupiedByStationId(@Param("stationId") int stationId);

    @Query("SELECT COUNT(cp) FROM ChargerPoint cp WHERE cp.station.id = :stationId AND cp.status = 'RESERVED' and cp.active=true")
    int countReservedByStationId(@Param("stationId") int stationId);

    @Query("SELECT COUNT(cp) FROM ChargerPoint cp WHERE cp.station.id = :stationId AND cp.status = 'OUT_OF_SERVICE' and cp.active=true")
    int countOutOfServiceByStationId(@Param("stationId") int stationId);

    boolean existsByChargerCostId(int chargerCostId);
}
