package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.model.request.ReservationRequest;
import com.ev.evchargingsystem.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    @Autowired
    private ReservationService reservationService;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<?> createReservation(Authentication authentication,
                                               @RequestBody ReservationRequest request) {
        String email = authentication.getName();  // lấy email đăng nhập của user
        String result = reservationService.createReservation(email, request);
        return ResponseEntity.ok(result);
    }
}