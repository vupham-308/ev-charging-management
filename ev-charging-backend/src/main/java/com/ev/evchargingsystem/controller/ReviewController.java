package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.model.request.ReviewStationRequest;
import com.ev.evchargingsystem.service.ReviewStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
