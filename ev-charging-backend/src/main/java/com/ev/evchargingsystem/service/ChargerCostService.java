package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.ChargerCost;
import com.ev.evchargingsystem.model.request.ChargerCostRequest;
import com.ev.evchargingsystem.repository.ChargerCostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChargerCostService {

    @Autowired
    ChargerCostRepository chargerCostRepository;

    public List<ChargerCost> getAll() {
        return chargerCostRepository.findAll();
    }

    public ChargerCost getById(int id) {
        return chargerCostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy, vui lòng kiểm tra lại id"));
    }

    public ChargerCost create(ChargerCostRequest request) {
        ChargerCost chargerCost = new ChargerCost();
        chargerCost.setPortType(request.getPortType());
        chargerCost.setPower(request.getCapacity());
        chargerCost.setCost(request.getCost());
        return chargerCostRepository.save(chargerCost);
    }

    public ChargerCost update(int id, ChargerCostRequest request) {
        ChargerCost existing = getById(id);
        existing.setPortType(request.getPortType());
        existing.setPower(request.getCapacity());
        existing.setCost(request.getCost());
        return chargerCostRepository.save(existing);
    }

    public void delete(int id) {
        if (!chargerCostRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy giá sạc với id: " + id);
        }
        chargerCostRepository.deleteById(id);
    }
}
