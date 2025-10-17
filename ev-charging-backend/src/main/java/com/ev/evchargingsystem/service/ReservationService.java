package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.ChargerPoint;
import com.ev.evchargingsystem.entity.Reservation;
import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.model.request.ReservationRequest;
import com.ev.evchargingsystem.repository.ChargerPointRepository;
import com.ev.evchargingsystem.repository.ReservationRepository;
import com.ev.evchargingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class ReservationService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ChargerPointRepository chargerPointRepository;
    @Autowired
    private ReservationRepository reservationRepository;

    public String createReservation(String username, ReservationRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(username);
        if (optionalUser.isEmpty()) {
            return "User not found";
        }
        User user = optionalUser.get();

        ChargerPoint cp = chargerPointRepository.findChargerPointById(request.getChargerPointId());
        if (cp == null) return "Charger point not found";

        if (!"AVAILABLE".equals(cp.getStatus())) {
            return "This charger point is not available";
        }

        Date start = request.getStartDate();
        Date end = request.getEndDate();

        if (start == null || end == null) return "Start and end time are required";
        if (end.before(start)) return "End time must be after start time";

        long diffMillis = end.getTime() - start.getTime();
        if (diffMillis > 2 * 60 * 60 * 1000) return "Reservation duration cannot exceed 2 hours";

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setChargerPoint(cp);
        reservation.setStartDate(start);
        reservation.setEndDate(end);
        reservation.setStatus("RESERVED");
        reservationRepository.save(reservation);

        cp.setStatus("RESERVED");
        chargerPointRepository.save(cp);

        return "Reservation successful";
    }
}
