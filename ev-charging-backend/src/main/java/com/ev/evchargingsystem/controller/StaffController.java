package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.entity.Staff;
import com.ev.evchargingsystem.entity.Station;
import com.ev.evchargingsystem.service.ChargerPointService;
import com.ev.evchargingsystem.service.StaffService;
import com.ev.evchargingsystem.service.StationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @GetMapping("/station/status")
    @PreAuthorize("hasAuthority('STAFF')")
    public ResponseEntity<?> getStationChargerStatus(@RequestParam int staffId) {
        Staff staff = staffService.getStaffById(staffId);
        if (staff == null) {
            return ResponseEntity.badRequest().body("Không tìm thấy staff có ID = " + staffId);
        }

        Station station = staff.getStation();
        if (station == null) {
            return ResponseEntity.badRequest().body("Staff này chưa được gán trạm quản lý nào.");
        }

        Map<String, Long> statusCount = chargerPointService.getChargerPointStatusByStation(station.getId());
        return ResponseEntity.ok(statusCount);
    }

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
}