package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.entity.Station;
import com.ev.evchargingsystem.model.response.StationResponse;
import com.ev.evchargingsystem.model.response.StationStatsResponseForAdmin;
import com.ev.evchargingsystem.repository.StationRepository;
import com.ev.evchargingsystem.service.StationService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/station")
public class StationController {

    @Autowired
    private StationService stationService;

    @PostMapping("/admin/create")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Station> addStation(@RequestBody Station station) {
        return ResponseEntity.ok(stationService.addStation(station));
    }

    @PutMapping("/admin/update/{id}")
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

    @DeleteMapping("/admin/delete/{id}")
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

    @Operation(summary = "Hiển thị danh sách trạm cho driver chọn")
    @GetMapping("/getAllStations")
    public ResponseEntity getStations(){
        List<StationResponse> list = stationService.getAllStations();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/get/{stationId}")
    public ResponseEntity getStaion(@PathVariable int stationId){
        return ResponseEntity.ok(stationService.getStation(stationId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<StationResponse>> searchStations(@RequestParam("keyword") String keyword) {
        List<StationResponse> stations = stationService.searchStations(keyword);
        return ResponseEntity.ok(stations);
    }

    @Operation(summary = "Amin xem thống kê trạm")
    @GetMapping("/station-stats")
    public ResponseEntity<StationStatsResponseForAdmin> getStationStats() {
        StationStatsResponseForAdmin stats = stationService.getStationStats();
        return ResponseEntity.ok(stats);
    }
}
