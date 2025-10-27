package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.entity.Staff;
import com.ev.evchargingsystem.entity.Station;
import com.ev.evchargingsystem.model.response.StaffDashboardResponse;
import com.ev.evchargingsystem.service.ChargerPointService;
import com.ev.evchargingsystem.service.StaffService;
import com.ev.evchargingsystem.service.StationService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @Autowired
    private ChargerPointService chargerPointService;

    @Autowired
    private StationService stationService;

    @Operation(summary = "STAFF xem trạng thái các trụ sạc thuộc trạm mình quản lý")
    @GetMapping("/station/status")
    @PreAuthorize("hasAuthority('STAFF')")
    public ResponseEntity<?> getStationChargerStatus(Authentication authentication) {
        String email = authentication.getName(); // lấy email từ token
        Staff staff = staffService.getByEmail(email);

        if (staff == null) {
            return ResponseEntity.badRequest().body("Không tìm thấy staff cho tài khoản này");
        }
        if (staff.getStation() == null) {
            return ResponseEntity.badRequest().body("Staff chưa được gán trạm nào");
        }

        // Truyền id trạm của staff để lấy thống kê
        return stationService.getStationChargerStatus(staff.getStation().getId());
    }

    @Operation(summary = "ADMIN gán trạm cho staff")
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{staffId}/assign-station/{stationId}")
    public ResponseEntity<?> assignStationToStaff(
            @PathVariable int staffId,
            @PathVariable int stationId
    ) {
        Staff staff = staffService.getStaffById(staffId);
        Station station = stationService.getStationById(stationId);
        staff.setStation(station);
        staffService.save(staff);

        return ResponseEntity.ok("Đã gán trạm " + station.getName() + " cho staff " + staff.getUser().getFullName());
    }

    @Operation(summary = "STAFF xem thống kê trong ngày của trạm mình quản lý")
    @GetMapping("/dashboard-status")
    @PreAuthorize("hasAuthority('STAFF')")
    public ResponseEntity<StaffDashboardResponse> getDashboard() {
        StaffDashboardResponse response = staffService.getTodayStats();
        return ResponseEntity.ok(response);
    }
}