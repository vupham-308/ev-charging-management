package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.model.request.ProblemRequest;
import com.ev.evchargingsystem.model.request.ProblemResponseRequest;
import com.ev.evchargingsystem.service.ProblemReportService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/problem")
public class ProblemReportController {
    @Autowired
    ProblemReportService problemReportService;

    @Operation(
            summary = "Driver, Staff: tạo mới yêu cầu hỗ trợ"
    )
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/create/{stationId}")
    public ResponseEntity create(@Valid @RequestBody ProblemRequest problemRequest, @PathVariable("stationId") int stationId) {
        problemReportService.create(problemRequest, stationId);
        return ResponseEntity.ok("Đã thêm mới yêu cầu hỗ trợ!");
    }

    @Operation(summary = "Driver, Staff: trả về tất cả các báo cáo của tài xế, staff")
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/getAll")
    public ResponseEntity getAllByDriver() {
        try {
            return ResponseEntity.ok(problemReportService.getAllByDriver());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Staff, Admin: phản hồi problem report của driver")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('STAFF')")
    @PutMapping("/response/{problemId}")
    public ResponseEntity response(@RequestBody ProblemResponseRequest p, @PathVariable("problemId") int id) {
        try {
            return ResponseEntity.ok(problemReportService.response(p, id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Staff: lấy tất cả problem theo stationId")
    @PreAuthorize("hasAuthority('STAFF')")
    @GetMapping("/get-all-by-staff")
    public ResponseEntity getAllByStaff() {
        try {
            return ResponseEntity.ok(problemReportService.getAllByStaff());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Admin: lấy danh sách tất cả problem")
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin/getAllResolve")
    public ResponseEntity getAllResolve() {
        try {
            return ResponseEntity.ok(problemReportService.getAllForAdmin());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Admin: lấy danh sách tất cả problem theo trạng thái")
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin/getAll/{status}")
    public ResponseEntity getAllByAd(@PathVariable("status") String status) {
        try {
            return ResponseEntity.ok(problemReportService.getAll(status));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Staff, Admin: chỉnh sửa trạng thái")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('STAFF')")
    @PutMapping("/admin/set/{status}")
    public ResponseEntity setStatus(int id, @PathVariable("status") String status) {
        try {
            return ResponseEntity.ok(problemReportService.setStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
