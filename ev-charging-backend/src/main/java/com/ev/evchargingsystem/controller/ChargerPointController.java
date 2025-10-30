package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.entity.ChargerPoint;
import com.ev.evchargingsystem.entity.Station;
import com.ev.evchargingsystem.model.request.ChargerPointRequest;
import com.ev.evchargingsystem.model.response.ChargerPointStatsResponseForAdmin;
import com.ev.evchargingsystem.model.response.StaffChargerPointResponse;
import com.ev.evchargingsystem.service.ChargerPointService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chargerPoint")
public class ChargerPointController {

    @Autowired
    ChargerPointService chargerPointService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/admin/create/{stationId}")
    public ResponseEntity addChargerPoint(@Valid @RequestBody ChargerPointRequest chargerPointRequest, @PathVariable int stationId) {
        try {
            ChargerPoint point = chargerPointService.add(chargerPointRequest, stationId);
            return ResponseEntity.status(HttpStatus.CREATED).body("Đã tạo!");
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/admin/delete")
    public ResponseEntity deleteChargerPoint(int chargerPointId) {
        try{
            boolean check = chargerPointService.delete(chargerPointId);
            return ResponseEntity.ok("Xóa thành công!");
        }catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/admin/update/{chargerPointId}")
    public ResponseEntity updateChargerPoint(@Valid @RequestBody ChargerPointRequest p, @PathVariable int chargerPointId) {//id chargerPoint
        try {
            ChargerPoint update = chargerPointService.update(p, chargerPointId);
            return ResponseEntity.ok("Đã cập nhật!");
        }catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/getAll/{stationID}")
    public ResponseEntity getAllChargerPoint(@PathVariable int stationID) {//id station
        List<ChargerPoint> list = chargerPointService.getAllByStation(stationID);
        if(list.size()==0){
            return ResponseEntity.badRequest().body("Hiện tại, trạm này không có trụ sạc nào!");
        }
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "Lấy danh sách trụ sạc theo trạm, chỉ lấy trụ nào Available")
    @GetMapping("/getAllAvailable/{stationID}")
    public ResponseEntity getAllChargerPointAvailable(@PathVariable int stationID) {//id station
        List<ChargerPoint> list = chargerPointService.getAllByStationAvailable(stationID);
        if(list.size()==0){
            return ResponseEntity.badRequest().body("Hiện tại, trạm này không có trụ sạc nào!");
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/get/{pointID}")
    public ResponseEntity getChargerPoint(@PathVariable int pointID) {
        return ResponseEntity.ok(chargerPointService.get(pointID));
    }

    @Operation(summary = "Admin xem các thống kê về trụ sạc")
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/charger-point-stats")
    public ResponseEntity<ChargerPointStatsResponseForAdmin> getChargerPointStats() {
        ChargerPointStatsResponseForAdmin stats = chargerPointService.getChargerPointStats();
        return ResponseEntity.ok(stats);
    }

    @Operation(summary = "Staff xem các thông tin về trụ sạc")
    @PreAuthorize("hasAuthority('STAFF')")
    @GetMapping("/staff/points")
    public ResponseEntity chargerPointStaff() {
        List<StaffChargerPointResponse> list = chargerPointService.chargerPointStaff();
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "Staff thay đổi trạng thái trụ sạc: AVAILABLE, ONGOING, OUT_OF_SERVICE")
    @PreAuthorize("hasAuthority('STAFF')")
    @PostMapping("/staff/point-status/{pointId}/{status}")
    public ResponseEntity chargerPointStatus(@PathVariable("pointId") int pointId, @PathVariable("status") String status) {
        return ResponseEntity.ok(chargerPointService.chargerPointStatus(pointId, status));
    }


}
