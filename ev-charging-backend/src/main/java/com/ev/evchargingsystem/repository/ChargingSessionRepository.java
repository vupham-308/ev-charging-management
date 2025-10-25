package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.Car;
import com.ev.evchargingsystem.entity.ChargingSession;
import com.ev.evchargingsystem.model.request.ChargingSessionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface ChargingSessionRepository extends JpaRepository<ChargingSession, Long> {
    List<ChargingSession> findChargingSessionByStatus(String status);

    ChargingSession findChargingSessionById(int sessionId);

    List<ChargingSession> findChargingSessionByCar(Car car);

    @Query("""
                SELECT c
                FROM ChargingSession c
                WHERE c.chargerPoint.station.id = :stationId
            """)
    List<ChargingSession> findChargingSessionByStationId(@Param("stationId") int stationId);

    @Query("""
                SELECT c 
                FROM ChargingSession c 
                WHERE c.car.user.id = :userId 
                  AND c.status = 'ONGOING'
            """)
    List<ChargingSession> findOngoingSessionsByUser(@Param("userId") int userId);

    void deleteByCar(Car car);

    // Tổng khách hàng
    @Query("""
        SELECT COUNT(DISTINCT cs.car.user.id)
        FROM ChargingSession cs
        WHERE cs.startTime BETWEEN :start AND :end
          AND cs.chargerPoint.station.id = :stationId
        """)
    long countDistinctUserByStationAndDate(@Param("stationId") int stationId,
                                           @Param("start") Date start,
                                           @Param("end") Date end);

    // Tổng phiên sạc
    @Query("""
        SELECT COUNT(cs)
        FROM ChargingSession cs
        WHERE cs.startTime BETWEEN :start AND :end
          AND cs.chargerPoint.station.id = :stationId
        """)
    long countByStationAndDate(@Param("stationId") int stationId,
                               @Param("start") Date start,
                               @Param("end") Date end);

    // Thời gian sạc trung bình (phút)
    @Query(value = """
        SELECT AVG(DATEDIFF(MINUTE, cs.start_time, cs.end_time))
        FROM charging_sessions cs
        JOIN charger_points cp ON cs.charger_point_id = cp.id
        WHERE cs.start_time BETWEEN :start AND :end
          AND cp.station_id = :stationId
        """, nativeQuery = true)
    Double findAverageChargingTimeByStationAndDate(
            @Param("stationId") int stationId,
            @Param("start") Date start,
            @Param("end") Date end
    );

    // Trụ sạc phổ biến nhất
    @Query(value = """
        SELECT TOP 1 cp.name
        FROM charging_sessions cs
        JOIN charger_points cp ON cs.charger_point_id = cp.id
        WHERE cs.start_time BETWEEN :start AND :end
          AND cp.station_id = :stationId
        GROUP BY cp.name
        ORDER BY COUNT(cs.id) DESC
        """, nativeQuery = true)
    String findMostUsedChargerPointByStationAndDate(
            @Param("stationId") int stationId,
            @Param("start") Date start,
            @Param("end") Date end
    );
}
