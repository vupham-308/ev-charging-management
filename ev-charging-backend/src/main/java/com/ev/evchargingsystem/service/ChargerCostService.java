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

    //ADMIN: chức năng chỉnh sửa giá dựa vào loại cổng sạc
    public boolean editCost(double newCost, int chargerCostId){
        ChargerCost c = chargerCostRepository.findById(chargerCostId).orElse(null);
        if(c==null) throw new RuntimeException("Không tìm thấy thông tin");
        c.setCost(newCost);
        chargerCostRepository.save(c);
        return true;
    }

    public List<ChargerCost> get() {
        return chargerCostRepository.findAll();
    }


    public ChargerCost create(ChargerCostRequest chargerCost) {
        return chargerCostRepository.save(new ChargerCost
                (chargerCost.getPortType(),chargerCost.getCapacity(),chargerCost.getCost()));
    }
}
