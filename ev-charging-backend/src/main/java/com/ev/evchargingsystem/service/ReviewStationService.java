package com.ev.evchargingsystem.service;


import com.ev.evchargingsystem.entity.ReviewStation;
import com.ev.evchargingsystem.entity.Station;
import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.model.request.ReviewStationRequest;
import com.ev.evchargingsystem.repository.ReviewStationRepository;
import com.ev.evchargingsystem.repository.StationRepository;
import com.ev.evchargingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class ReviewStationService {

    @Autowired
    private ReviewStationRepository reviewRepo;

    @Autowired
    private StationRepository stationRepo;

    @Autowired
    private UserRepository userRepo;

    public String createReview(ReviewStationRequest request) {
        // Lấy user hiện tại từ token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<User> userOpt = userRepo.findByEmail(username);
        if (userOpt.isEmpty()) {
            return "User not found";
        }

        Optional<Station> stationOpt = stationRepo.findById(request.getStationId());
        if (stationOpt.isEmpty()) {
            return "Station not found";
        }

        ReviewStation review = new ReviewStation();
        review.setStation(stationOpt.get());
        review.setUser(userOpt.get());
        review.setDescription(request.getDescription());
        review.setRating(request.getRating());
        review.setReviewDate(
                request.getReviewDate() != null ? request.getReviewDate() : new Date()
        );

        reviewRepo.save(review);
        return "Review created successfully";
    }

    public String deleteReview(int id) {
        reviewRepo.deleteById(id);
        return "Review deleted successfully";
    }
}
