package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.entity.ChargerPoint;
import com.ev.evchargingsystem.entity.Station;
import com.ev.evchargingsystem.model.request.ChargerPointRequest;
import com.ev.evchargingsystem.service.ChargerPointService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ChargerPointController {

    @Autowired
    ChargerPointService chargerPointService;

    @PostMapping("/ad/create/{stationId}")
    public ResponseEntity addChargerPoint(@Valid @RequestBody ChargerPointRequest chargerPointRequest, @PathVariable int stationId) {
        try {
            ChargerPoint point = chargerPointService.add(chargerPointRequest, stationId);
            return ResponseEntity.status(HttpStatus.CREATED).body("Created!");
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/ad/delete")
    public ResponseEntity deleteChargerPoint(int chargerPointId) {
        try{
            boolean check = chargerPointService.delete(chargerPointId);
            return ResponseEntity.ok("Delete successfully!");
        }catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/ad/update/{chargerPointId}")
    public ResponseEntity updateChargerPoint(@Valid @RequestBody ChargerPointRequest p, @PathVariable int chargerPointId) {//id chargerPoint
        try {
            ChargerPoint update = chargerPointService.update(p, chargerPointId);
            return ResponseEntity.ok("Updated!");
        }catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity getAllChargerPoint(int station) {//id station
        chargerPointService.getAllByStation(station);
        return ResponseEntity.ok(chargerPointService.getAllByStation(station));
    }

    @GetMapping("/get")
    public ResponseEntity getChargerPoint(int id) {
        return ResponseEntity.ok(chargerPointService.get(id));
    }
}
