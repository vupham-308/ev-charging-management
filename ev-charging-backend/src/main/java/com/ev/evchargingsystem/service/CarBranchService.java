package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.CarBranch;
import com.ev.evchargingsystem.repository.CarBranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarBranchService {

    @Autowired
    CarBranchRepository carBranchRepository;

    public List<CarBranch> getAllCarBranches() {
        return carBranchRepository.findAll();
    }

    public CarBranch getCarBranchById(int id) {
        return carBranchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hãng xe với id: " + id));
    }

    public CarBranch addNewCarBranch(CarBranch carBranch) {
        return carBranchRepository.save(carBranch);
    }

    public CarBranch updateCarBranch(int id, CarBranch carBranchDetails) {
        if (carBranchRepository.existsById(id)) {
            carBranchDetails.setId(id);
            return carBranchRepository.save(carBranchDetails);
        }
        throw new RuntimeException("Không tìm thấy hãng xe với id: " + id);
    }

    public void deleteCarBranch(int id) {
        CarBranch carBranch = carBranchRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Không tìm thấy hãng xe với id: " + id));
            carBranch.setActive(false);
            carBranchRepository.save(carBranch);
        }
    }

