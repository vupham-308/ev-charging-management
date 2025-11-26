package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.entity.Reservation;
import com.ev.evchargingsystem.model.request.ReservationRequest;
import com.ev.evchargingsystem.model.response.ReservationResponse;
import com.ev.evchargingsystem.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    @Autowired
    private ReservationService reservationService;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('USER')")
    @Operation(summary = "json mẫu: {\"chargerPointId\":1,\"startDate\":\"2025-07-01 10:00:00\",\"endDate\":\"2025-07-01 12:00:00\"}")
    public ResponseEntity<?> createReservation(Authentication authentication,
                                               @RequestBody ReservationRequest request) {
        String email = authentication.getName();
        String result = reservationService.createReservation(email, request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/my")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<?> getUserReservations(Authentication authentication) {
        String email = authentication.getName();
        List<ReservationResponse> reservations = reservationService.getUserReservations(email);
        return ResponseEntity.ok(reservations);
    }

//    @Operation(summary = "json mẫu: {\"pointId\":1,\"date\":\"2025-10-31\"}")
//    @GetMapping("/locked/{pointId}/{date}")
//    public ResponseEntity getLockedReservations(@PathVariable("pointId") int id,
//                                                @PathVariable("date") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
//        List<ReservationResponse> reservations = reservationService.getLockedReservations(id, date);
//        return ResponseEntity.ok(reservations);
//    }

    @GetMapping("/lock")
    public ResponseEntity getAllReservations() {
        List<ReservationResponse> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(reservations);
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancelReservation(@PathVariable("id") int id) {
        try {
            reservationService.cancelReservation(id);
            return ResponseEntity.ok("Đã hủy đặt chỗ thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Lọc theo station, trạng thái PENDING, để gửi xác nhận cho người dùng")
    @GetMapping("/getByStationID")
    public ResponseEntity getByStationID(@RequestParam int stationId) {
        Reservation r = reservationService.getByStationId(stationId);
        if(r==null) return ResponseEntity.status(404).body("Không tìm thấy đặt chỗ nào");
        return ResponseEntity.ok(r);
    }

}