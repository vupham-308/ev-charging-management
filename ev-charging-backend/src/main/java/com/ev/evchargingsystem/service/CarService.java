package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.Car;
import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.model.request.CarCreateRequest;
import com.ev.evchargingsystem.model.response.CarResponse;
import com.ev.evchargingsystem.repository.CarRepository;
import com.ev.evchargingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private UserRepository userRepository;

    // Lấy thông tin người dùng đang đăng nhập
    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails)principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private CarResponse toCarResponse(Car car) {
        CarResponse res = new CarResponse();
        res.setId(car.getId());
        res.setBrand(car.getBrand());
        res.setColor(car.getColor());
        res.setInitBattery(car.getInitBattery());
        res.setLicensePlate(car.getLicensePlate());
        return res;
    }

    // Thêm xe mới cho người dùng hiện tại
    public Car addCar(CarCreateRequest req) {
        User currentUser = getCurrentUser();
        Car car = new Car();
        car.setBrand(req.getBrand());
        car.setColor(req.getColor());
        car.setInitBattery(req.getInitBattery());
        car.setLicensePlate(req.getLicensePlate());
        car.setUser(currentUser); // gán theo user đăng nhập
        return carRepository.save(car);
    }

    // Lấy danh sách xe của người dùng hiện tại
    public List<CarResponse> getUserCars() {
        User currentUser = getCurrentUser();
        return carRepository.findByUser(currentUser)
                .stream()
                .map(this::toCarResponse)
                .collect(Collectors.toList());
    }

    // Lấy xe theo ID (chỉ trả về nếu xe đó thuộc người dùng hiện tại)
    public Optional<CarResponse> getCarById(int carId) {
        User currentUser = getCurrentUser();
        return carRepository.findByIdAndUserId(carId, currentUser.getId())
                .map(this::toCarResponse);
    }

    // Cập nhật thông tin xe
    public Optional<CarResponse> updateCar(int carId, CarCreateRequest req) {
        User currentUser = getCurrentUser();

        // chỉ tìm xe của user hiện tại
        Optional<Car> carOpt = carRepository.findByIdAndUserId(carId, currentUser.getId());
        if (carOpt.isEmpty()) {
            return Optional.empty();
        }

        Car car = carOpt.get();
        // cập nhật thông tin từ request
        car.setBrand(req.getBrand());
        car.setColor(req.getColor());
        car.setInitBattery(req.getInitBattery());
        car.setLicensePlate(req.getLicensePlate());

        Car updated = carRepository.save(car);
        return Optional.of(toCarResponse(updated));
    }

    // Xóa xe
    public void deleteCar(int id) {
        User currentUser = getCurrentUser();

        Car car = carRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Car not found or not owned by current user"));
        carRepository.delete(car);
    }

}