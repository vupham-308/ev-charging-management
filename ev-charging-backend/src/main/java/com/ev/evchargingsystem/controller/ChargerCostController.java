package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.service.ChargerCostService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    @PutMapping("edit-cost/{portType}")
    public ResponseEntity editChargerPointCost(float newCost, @PathVariable("portType") String chargerType){
        try{
            if(chargerCostService.editCost(newCost, chargerType)) {
                return ResponseEntity.ok("Đã thay đổi giá!");
            }
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
