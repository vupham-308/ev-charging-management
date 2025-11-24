package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.entity.ChargerCost;
import com.ev.evchargingsystem.model.request.ChargerCostRequest;
import com.ev.evchargingsystem.service.ChargerCostService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/charger-cost")
public class ChargerCostController {

    @Autowired
    ChargerCostService chargerCostService;

    @GetMapping
    public ResponseEntity<List<ChargerCost>> getAll() {
        return ResponseEntity.ok(chargerCostService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChargerCost> getById(@PathVariable int id) {
        return ResponseEntity.ok(chargerCostService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ChargerCost> create(@RequestBody @Valid ChargerCostRequest request) {
        return ResponseEntity.ok(chargerCostService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChargerCost> update(@PathVariable int id, @RequestBody @Valid ChargerCostRequest request) {
        return ResponseEntity.ok(chargerCostService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        chargerCostService.delete(id);
        return ResponseEntity.ok().build();
    }
}

