package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.Car;
import com.ev.evchargingsystem.entity.ChargingSession;
import com.ev.evchargingsystem.model.request.ChargingSessionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChargingSessionRepository extends JpaRepository<ChargingSession,Long> {
    List<ChargingSession> findChargingSessionByStatus(String status);

    ChargingSession findChargingSessionById(int sessionId);

    ChargingSession findChargingSessionByCar(Car car);

    @Query("""
        SELECT c 
        FROM ChargingSession c 
        WHERE c.car.user.id = :userId 
          AND c.status = 'ONGOING'
    """)
    List<ChargingSession> findOngoingSessionsByUser(@Param("userId") int userId);
}
