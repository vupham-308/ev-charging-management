package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.entity.Car;
import com.ev.evchargingsystem.model.request.CarCreateRequest;
import com.ev.evchargingsystem.model.response.CarResponse;
import com.ev.evchargingsystem.service.CarService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
public class CarController {

    @Autowired
    private CarService carService;

    @PostMapping
    public Car addCar(@RequestBody @Valid CarCreateRequest request) {
        return carService.addCar(request);
    }

    @GetMapping
    public List<CarResponse> getUserCars() {
        return carService.getUserCars();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarResponse> getCarById(@PathVariable("id") int carId) {
        return carService.getCarById(carId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarResponse> updateCar(@PathVariable("id") int id,
                                                 @RequestBody @Valid CarCreateRequest request) {

        return carService.updateCar(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable(value = "id") int carId) {
        try {
            carService.deleteCar(carId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}