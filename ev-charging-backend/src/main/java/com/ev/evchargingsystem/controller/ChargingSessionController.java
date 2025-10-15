package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.model.request.ChargingSessionRequest;
import com.ev.evchargingsystem.service.ChargingSessionService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ChargingSessionController {

    @Autowired
    ChargingSessionService chargingSessionService;

    @Operation(summary = "Driver: nhấn Bắt đầu sạc")
    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/charge")
    public ResponseEntity charge(@RequestBody ChargingSessionRequest chargingSessionRequest) {
        try {
            return ResponseEntity.ok(chargingSessionService.charge(chargingSessionRequest));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
