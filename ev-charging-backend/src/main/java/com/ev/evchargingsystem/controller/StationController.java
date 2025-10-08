package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.entity.Station;
import com.ev.evchargingsystem.repository.StationRepository;
import com.ev.evchargingsystem.service.StationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ad/stations")
public class StationController {

    @Autowired
    private StationService stationService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Station> addStation(@RequestBody Station station) {
        return ResponseEntity.ok(stationService.addStation(station));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Station> updateStation(@PathVariable Integer id, @RequestBody Station stationDetails) {
        Station updatedStation = stationService.updateStation(id, stationDetails);

        // Kiểm tra kết quả trả về từ Service
        if (updatedStation != null) {
            return ResponseEntity.ok(updatedStation);
        } else {
            // Nếu không tìm thấy Station, trả về lỗi 404 Not Found
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> deleteStation(@PathVariable Integer id) {
        boolean isDeleted = stationService.deleteStation(id);
        if (isDeleted) {
            // Trả về 204 No Content - là mã thành công cho request DELETE
            return ResponseEntity.ok("Xóa thành công");
        } else {
            // Trả về 404 Not Found nếu không tìm thấy Station để xóa
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy station với ID: " + id);
        }
    }
}
