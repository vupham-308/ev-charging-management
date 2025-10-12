package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.model.request.ProblemRequest;
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
    public ResponseEntity create(@Valid @RequestBody ProblemRequest problemRequest, @PathVariable int stationId) {
        problemReportService.create(problemRequest, stationId);
        return ResponseEntity.ok("Đã thêm mới yêu cầu hỗ trợ!");
    }

    @Operation(summary = "Driver: trả về tất cả các báo cáo của tài xế")
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/getAll")
    public ResponseEntity getAllByDriver() {
        try {
            return ResponseEntity.ok(problemReportService.getAllByDriver());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
