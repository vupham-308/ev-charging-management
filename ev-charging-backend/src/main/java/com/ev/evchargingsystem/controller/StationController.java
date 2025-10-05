package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.entity.Station;
import com.ev.evchargingsystem.repository.StationRepository;
import com.ev.evchargingsystem.service.StationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stations")
public class StationController {

    @Autowired
    private StationService stationService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Station> addStation(@RequestBody Station station) {
        return ResponseEntity.ok(stationService.addStation(station));
    }
}
