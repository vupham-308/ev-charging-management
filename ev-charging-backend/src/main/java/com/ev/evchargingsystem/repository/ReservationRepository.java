package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.ChargerPoint;
import com.ev.evchargingsystem.entity.Reservation;
import com.ev.evchargingsystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    List<Reservation> findByUserId(int userId);

    List<Reservation> findByUserIdAndStatus(int userId, String status);

    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId AND r.status = 'PENDING' AND r.chargerPoint.station.id = :stationId")
    List<Reservation> findPendingReservationByUserAndStation(@Param("userId") int userId, @Param("stationId") int stationId);


    List<Reservation> findAllByStatus(String status);

    List<Reservation> findByStatus(String status);

    List<Reservation> findByChargerPointIdAndStatus(int chargerPointId, String status);

    void deleteByUser(User user);

    Optional<Reservation> findByIdAndUserId(Integer reservationId, Integer userId);

}
