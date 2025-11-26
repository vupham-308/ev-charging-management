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
    @Autowired
    com.ev.evchargingsystem.repository.ChargerPointRepository chargerPointRepository;
    @Autowired
    com.ev.evchargingsystem.repository.ChargingSessionRepository chargingSessionRepository;

    public List<ChargerCost> getAll() {
        return chargerCostRepository.findAll();
    }

    public ChargerCost getById(int id) {
        return chargerCostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy, vui lòng kiểm tra lại id"));
    }

    public ChargerCost create(ChargerCostRequest request) {
        if (chargerCostRepository.existsByPortType(request.getPortType())) {
            throw new RuntimeException("Loại cổng sạc này đã tồn tại!");
        }
        ChargerCost chargerCost = new ChargerCost();
        chargerCost.setPortType(request.getPortType());
        chargerCost.setPower(request.getPower());
        chargerCost.setCost(request.getCost());
        return chargerCostRepository.save(chargerCost);
    }

    public ChargerCost update(int id, ChargerCostRequest request) {
        ChargerCost existing = getById(id);

        if (chargingSessionRepository.existsOngoingSessionByCostId(id)) {
            throw new RuntimeException("Không thể cập nhật giá! Đang có phiên sạc sử dụng gói giá này.");
        }

        existing.setPortType(request.getPortType());
        existing.setPower(request.getPower());
        existing.setCost(request.getCost());
        return chargerCostRepository.save(existing);
    }

    public void delete(int id) {
        getById(id);
        if (chargerPointRepository.existsByChargerCostId(id)) {
            throw new RuntimeException("Không thể xóa! Giá sạc này đang được sử dụng bởi một hoặc nhiều trụ sạc.");
        }
        chargerCostRepository.deleteById(id);
    }
}
