package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.Car;
import com.ev.evchargingsystem.entity.CarBranch;
import com.ev.evchargingsystem.entity.ChargingSession;
import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.model.request.CarCreateRequest;
import com.ev.evchargingsystem.model.response.CarResponse;
import com.ev.evchargingsystem.repository.CarBranchRepository;
import com.ev.evchargingsystem.repository.CarRepository;
import com.ev.evchargingsystem.repository.ChargingSessionRepository;
import com.ev.evchargingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ChargingSessionRepository chargingSessionRepository;
    @Autowired
    private CarBranchRepository carBranchRepository;

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private CarResponse toCarResponse(Car car) {
        CarResponse res = new CarResponse();
        res.setId(car.getId());
        res.setBrand(car.getCarBranch().getBrand());
        res.setColor(car.getColor());
        res.setInitBattery(car.getInitBattery());
        res.setLicensePlate(car.getLicensePlate());
        return res;
    }

    // Thêm xe
    public Car addCar(CarCreateRequest req) {
        //check biển số trong database
        Car car = carRepository.findByLicensePlate(req.getLicensePlate());
        if(car==null) car= new Car();
        User currentUser = getCurrentUser();
        List<CarBranch> list = carBranchRepository.findAll();
        for(CarBranch branch : list) {
            if (req.getBrand().equalsIgnoreCase(branch.getBrand())){
                car.setCarBranch(branch);
            }
        }
        car.setColor(req.getColor());
        car.setLicensePlate(req.getLicensePlate());

        // Random pin
        double randomBattery = Math.round(new Random().nextDouble(car.getCarBranch().getBatteryCapacity()) * 1000.0) / 1000.0;
        car.setInitBattery(randomBattery);

        car.setUser(currentUser);
        car.setActive(true);
        return carRepository.save(car);
    }

    // Lấy danh sách xe của người dùng hiện tại
    public List<CarResponse> getUserCars() {
        User currentUser = getCurrentUser();
        return carRepository.findByUserAndActiveTrue(currentUser)
                .stream()
                .map(this::toCarResponse)
                .collect(Collectors.toList());
    }

    public Optional<CarResponse> getCarById(int carId) {
        User currentUser = getCurrentUser();
        return carRepository.findByIdAndUserId(carId, currentUser.getId())
                .filter(Car::isActive)
                .map(this::toCarResponse);
    }

    // Cập nhật thông tin xe
    public Optional<CarResponse> updateCar(int carId, CarCreateRequest req) {
        User currentUser = getCurrentUser();

        Optional<Car> carOpt = carRepository.findByIdAndUserId(carId, currentUser.getId());
        if (carOpt.isEmpty()) {
            return Optional.empty();
        }

        Car car = carOpt.get();

        List<CarBranch> list = carBranchRepository.findAll();
        for(CarBranch branch : list) {
            if (req.getBrand().equalsIgnoreCase(branch.getBrand())){
                car.setCarBranch(branch);
            }
        }
        car.setColor(req.getColor());
        car.setLicensePlate(req.getLicensePlate());

        Car updated = carRepository.save(car);
        return Optional.of(toCarResponse(updated));
    }

    // Xóa xe
    public void deleteCar(int id) {
        User currentUser = getCurrentUser();
        Car car = carRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe với ID: " + id));

        List<ChargingSession> list = chargingSessionRepository.findChargingSessionByCar(car);
        for(ChargingSession c : list){
            if(c.getStatus().equals("ONGOING")){
                throw new RuntimeException("Xe đang trong phiên sạc, không thể xóa");
            }
        }
        if (!car.isActive()) {
            throw new RuntimeException("Xe này đã bị xóa");
        }

        car.setActive(false);
        carRepository.save(car);

    }
}