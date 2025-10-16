package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.ChargingSession;
import com.ev.evchargingsystem.model.request.ChargingSessionRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChargingSessionRepository extends JpaRepository<ChargingSession,Long> {
    List<ChargingSession> findChargingSessionByStatus(String status);

    ChargingSession findChargingSessionById(int sessionId);
}
