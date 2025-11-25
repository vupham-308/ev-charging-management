package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.entity.ChargerCost;
import com.ev.evchargingsystem.model.request.ChargerCostRequest;
import com.ev.evchargingsystem.service.ChargerCostService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class ChargerCostController {

    @Autowired
    ChargerCostService chargerCostService;

    //ADMIN: chức năng sửa giá sạc phụ thuộc vào cổng sạc
    @Operation(
            summary = "ADMIN: thay đổi giá trạm sạc phụ thuộc vào cổng sạc"
    )
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("edit-cost/{chargerCostId}")
    public ResponseEntity editChargerPointCost(float newCost, @PathVariable("chargerCostId") int chargerCostId) {
        try {
            if (chargerCostService.editCost(newCost, chargerCostId)) {
                return ResponseEntity.ok("Đã thay đổi giá!");
            }
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("get")
    public ResponseEntity getCost() {
        return ResponseEntity.ok(chargerCostService.get());
    }


    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity create(ChargerCostRequest chargerCost) {
        return ResponseEntity.ok(chargerCostService.create(chargerCost));
    }
}

