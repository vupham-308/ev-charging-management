package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.model.request.ReviewStationRequest;
import com.ev.evchargingsystem.service.ReviewStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping ("/api/review")
public class ReviewController {

    @Autowired
    private ReviewStationService reviewService;

    @PostMapping("/create")
    public ResponseEntity<?> createReview(@RequestBody ReviewStationRequest request) {
        String message = reviewService.createReview(request);
        return ResponseEntity.ok(message);
    }


    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable int id) {
        String message = reviewService.deleteReview(id);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/station/{stationId}")
    public ResponseEntity<?> getReviewsByStation(@PathVariable int stationId) {
        return ResponseEntity.ok(reviewService.getReviewsByStation(stationId));
    }
}
