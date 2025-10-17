package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.ChargerPoint;
import com.ev.evchargingsystem.entity.Reservation;
import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.model.request.ReservationRequest;
import com.ev.evchargingsystem.model.response.ReservationResponse;
import com.ev.evchargingsystem.repository.ChargerPointRepository;
import com.ev.evchargingsystem.repository.ReservationRepository;
import com.ev.evchargingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ReservationService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ChargerPointRepository chargerPointRepository;
    @Autowired
    private ReservationRepository reservationRepository;

    public String createReservation(String email, ReservationRequest request) {
        // 1) Lấy user theo email từ token
        Optional<User> optionalUser = userRepository.findByEmail(email);
        User user = optionalUser.get();

        // 2) Lấy trụ sạc
        ChargerPoint cp = chargerPointRepository.findChargerPointById(request.getChargerPointId());

        // 3) Trụ phải đang AVAILABLE mới cho đặt
        if (!"AVAILABLE".equalsIgnoreCase(cp.getStatus())) {
            return "This charger point is not available";
        }

        // 4) Validate thời gian
        Date start = request.getStartDate();
        Date end = request.getEndDate();

        if (start == null || end == null) {
            return "Start and end time are required";
        }
        if (end.before(start)) {
            return "End time must be after start time";
        }
        long durationMillis = end.getTime() - start.getTime();
        if (durationMillis > 2 * 60 * 60 * 1000L) { // tối đa 2 tiếng
            return "Reservation duration cannot exceed 2 hours";
        }

        // (Optional) Không cho đặt ở quá khứ
        Date now = new Date();
        if (end.before(now)) {
            return "Reservation time must be in the future";
        }

        // 5) Tạo reservation (status = PENDING để đúng CHECK constraint)
        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setChargerPoint(cp);
        reservation.setStartDate(start);
        reservation.setEndDate(end);
        reservation.setStatus("PENDING");
        reservationRepository.save(reservation);

        // 6) Đánh dấu trụ đã được giữ chỗ
        cp.setStatus("RESERVED");
        chargerPointRepository.save(cp);

        return "Reservation successful";
    }

    public List<ReservationResponse> getUserReservations(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return Collections.emptyList();
        }
        User user = optionalUser.get();

        List<Reservation> reservations = reservationRepository.findByUserId(user.getId());
        List<ReservationResponse> result = new ArrayList<>();

        for (Reservation r : reservations) {
            ReservationResponse dto = new ReservationResponse();
            dto.setId(r.getId());
            dto.setStatus(r.getStatus());
            dto.setStartDate(r.getStartDate());
            dto.setEndDate(r.getEndDate());

            // Lấy tên trụ và trạm
            if (r.getChargerPoint() != null) {
                dto.setChargerPointName(r.getChargerPoint().getName());
                if (r.getChargerPoint().getStation() != null) {
                    dto.setStationName(r.getChargerPoint().getStation().getName());
                }
            }
            result.add(dto);
        }
        return result;
    }
}
