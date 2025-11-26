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

import java.util.*;
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
        res.setInitBattery(convertBatteryToPercent(car));
        res.setLicensePlate(car.getLicensePlate());
        return res;
    }

    // Thêm xe
    public CarResponse addCar(CarCreateRequest req) {
        //check biển số trong database, nếu active=true thì throw lỗi
        Car car = carRepository.findByLicensePlate(req.getLicensePlate());
        if(car==null) car= new Car();
        else if(car.isActive()) throw new RuntimeException("Xe đã tồn tại trong hệ thống!");
        User currentUser = getCurrentUser();
        List<CarBranch> list = carBranchRepository.findAll();
        for(CarBranch branch : list) {
            if (req.getBrand().equalsIgnoreCase(branch.getBrand())){
                car.setCarBranch(branch);
            }
        }
        if(car.getCarBranch()==null){
            throw new RuntimeException("Loại xe không hợp lệ!");
        }
        car.setColor(req.getColor());
        car.setLicensePlate(req.getLicensePlate());

        // Random pin
        double randomBattery = Math.round(new Random().nextDouble(car.getCarBranch().getBatteryCapacity()) * 1000.0) / 1000.0;
        car.setInitBattery(randomBattery);

        car.setUser(currentUser);
        car.setActive(true);
        carRepository.save(car);
        return toCarResponse(car);
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
    public int convertBatteryToPercent(Car car){
        return (int) Math.round(car.getInitBattery()/car.getCarBranch().getBatteryCapacity()*100);

    }

    public Set<String> getAllCarsByPortType(String portType) {
        User currentUser = getCurrentUser();
        List<Car> list= carRepository.findAll().stream()
                .filter(car -> car.getCarBranch().getPortType().equalsIgnoreCase(portType))
                .filter(car -> car.getUser().getId() == currentUser.getId())
                .filter(car -> car.isActive())
                .collect(Collectors.toList());
        Set<String> rs = new HashSet<>();
        for(Car c : list){
            rs.add(c.getCarBranch().getBrand());
        }
        return rs;
    }
}