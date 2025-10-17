package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.model.request.ReservationRequest;
import com.ev.evchargingsystem.model.response.ReservationResponse;
import com.ev.evchargingsystem.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    @Autowired
    private ReservationService reservationService;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('USER')")
    @Operation(summary = "json mẫu: {\"chargerPointId\":1,\"startDate\":\"2024-07-01 10:00:00\",\"endDate\":\"2024-07-01 12:00:00\"}")
    public ResponseEntity<?> createReservation(Authentication authentication,
                                               @RequestBody ReservationRequest request) {
        String email = authentication.getName();  // lấy email đăng nhập của user
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
}