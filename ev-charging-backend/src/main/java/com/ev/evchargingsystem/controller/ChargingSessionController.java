package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.model.request.ChargingSessionRequest;
import com.ev.evchargingsystem.service.ChargingSessionService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ChargingSessionController {

    @Autowired
    ChargingSessionService chargingSessionService;

    @Operation(summary = "Driver: tạo 1 phiên sạc (chưa bắt đầu)")
    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/charge")
    public ResponseEntity charge(@RequestBody ChargingSessionRequest chargingSessionRequest) {
        try {
            return ResponseEntity.ok(chargingSessionService.createSession(chargingSessionRequest));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @Operation(summary = "Driver: Bắt đầu sạc")
    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/charging/{sessionId}")
    public ResponseEntity charging(@PathVariable("sessionId") int sessionId) {
        try {
            return ResponseEntity.ok(chargingSessionService.charge(sessionId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
