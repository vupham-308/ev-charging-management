package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.CarBranch;
import com.ev.evchargingsystem.entity.ChargerCost;
import com.ev.evchargingsystem.repository.CarBranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarBranchService {

    @Autowired
    CarBranchRepository carBranchRepository;
    @Autowired
    ChargerCostService chargerCostService;

    public List<CarBranch> getAllCarBranches() {
        return carBranchRepository.findAllByActive(true);
    }

    public CarBranch getCarBranchById(int id) {
        CarBranch c = carBranchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hãng xe với id: " + id));
        if(c.isActive()) {
            return c;
        }
        else {
            throw new RuntimeException("Hãng xe với id: " + id + " không còn hoạt động.");
        }
    }

    public CarBranch addNewCarBranch(CarBranch carBranch) {
        List<ChargerCost> list = chargerCostService.getAll();
        for(ChargerCost cc : list){
            if(cc.getPortType().equals(carBranch.getPortType())){
                return carBranchRepository.save(carBranch);
            }
        }

        return null;
    }

    public CarBranch updateCarBranch(int id, CarBranch carBranchDetails) {
        CarBranch existingCarBranch = carBranchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hãng xe với id: " + id));
        if(!existingCarBranch.isActive()) {
            throw new RuntimeException("Hãng xe với id: " + id + " không còn hoạt động.");
        }
        existingCarBranch.setBrand(carBranchDetails.getBrand());
        existingCarBranch.setBatteryCapacity(carBranchDetails.getBatteryCapacity());
        existingCarBranch.setPortType(carBranchDetails.getPortType());

        return carBranchRepository.save(existingCarBranch);
    }

    public void deleteCarBranch(int id) {
        CarBranch carBranch = carBranchRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Không tìm thấy hãng xe với id: " + id));
            carBranch.setActive(false);
            carBranchRepository.save(carBranch);
        }
    }

