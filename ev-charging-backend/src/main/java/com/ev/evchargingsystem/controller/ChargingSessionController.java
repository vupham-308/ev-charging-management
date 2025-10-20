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
    public ResponseEntity charge(
                                 @RequestBody ChargingSessionRequest chargingSessionRequest) {
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
            chargingSessionService.charge(sessionId);
            return ResponseEntity.ok("Đang sạc, vui lòng kiểm tra chi tiết tại 'Phiên sạc của tôi'");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Driver: Hiển thị tất cả phiên sạc đang sạc")
    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/chargingsessions")
    public ResponseEntity viewSession() {
        try {
            return ResponseEntity.ok(chargingSessionService.view());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Driver: Dừng phiên sạc")
    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/stop/{sessionId}")
    public ResponseEntity stop(@PathVariable("sessionId") int sessionId) {
        try {
            chargingSessionService.stopCharge(sessionId);
            return ResponseEntity.ok("Đã dừng phiên sạc!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Staff: Trả về tất cả Session theo trạm sạc")
    @PreAuthorize("hasAuthority('STAFF')")
    @GetMapping("/getAllByStaff")
    public ResponseEntity getAllByStaff() {
        try {
            return ResponseEntity.ok(chargingSessionService.getAllByStaff());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Staff: Thanh toán tiền mặt")
    @PreAuthorize("hasAuthority('STAFF')")
    @PostMapping("/cash/{sessionId}")
    public ResponseEntity cash(@PathVariable("sessionId") int sessionId) {
        try {
            return ResponseEntity.ok(chargingSessionService.payByCash(sessionId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
