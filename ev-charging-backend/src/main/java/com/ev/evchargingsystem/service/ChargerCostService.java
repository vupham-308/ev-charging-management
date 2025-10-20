package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.ChargerCost;
import com.ev.evchargingsystem.repository.ChargerCostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChargerCostService {

    @Autowired
    ChargerCostRepository chargerCostRepository;

    //ADMIN: chức năng chỉnh sửa giá dựa vào loại cổng sạc
    public boolean editCost(float newCost, String portType){
        if(!portType.equals("AC")&&!portType.equals("CHAdeMO")&&!portType.equals("CCS")){
            throw new RuntimeException("Invalid portType");
        }
        ChargerCost c = chargerCostRepository.findChargerCostByPortType(portType);
        c.setCost(newCost);
        chargerCostRepository.save(c);
        return true;
    }

    public List<ChargerCost> get() {
        return chargerCostRepository.findAll();
    }
}
