package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.ChargerCost;
import com.ev.evchargingsystem.entity.ChargerPoint;
import com.ev.evchargingsystem.entity.Station;
import com.ev.evchargingsystem.model.request.ChargerPointRequest;
import com.ev.evchargingsystem.repository.ChargerCostRepository;
import com.ev.evchargingsystem.repository.ChargerPointRepository;
import com.ev.evchargingsystem.repository.StationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ChargerPointService {

    @Autowired
    ChargerPointRepository chargerPointRepository;

    @Autowired
    ChargerCostRepository chargerCostRepository;

    @Autowired
    StationRepository stationRepository;

    //ADMIN: thêm 1 trụ sạc
    public ChargerPoint add(ChargerPointRequest rq, int stationID) {
        Station station = stationRepository.findStationsById(stationID);
        if (station == null) {
            //thiếu check role AD?
            throw new RuntimeException("StationID not found: "+stationID);
        }
        ChargerCost cost = chargerCostRepository.findChargerCostByPortType(rq.getPortType());
        ChargerPoint p = new ChargerPoint();
        p.setStation(station);
        p.setName(rq.getName());
        p.setCapacity(getCapacity(rq.getPortType()));//cost
        p.setChargerCost(cost);
        p.setStatus(rq.getStatus());
        return chargerPointRepository.save(p);
    }

    //dựa vào Porttype để trả về Capacity tương ứng
    public int getCapacity(String portType){
        if(portType.equals("AC")){
            return 22;
        }
        else if(portType.equals("CHAdeMO")){
            return 100;
        } else if (portType.equals("CCS")) {
            return 250;
        }
        return 0;
    }

    public boolean delete(int id){
        ChargerPoint chargerPoint = chargerPointRepository.findChargerPointById(id);
        if (chargerPoint == null) {
            throw new RuntimeException("ChargerPoint with id "+id+" not found!");
        }
        chargerPointRepository.delete(chargerPoint);
        if(chargerPointRepository.findById(id).isPresent()){
            return false;
        }
        return true;
    }

    public ChargerPoint update(ChargerPointRequest p, int chargerPointId) {
        ChargerPoint c = chargerPointRepository.findChargerPointById(chargerPointId);
        if(c == null){
            throw new RuntimeException("ChargerPoint with id "+chargerPointId+" not found!");
        }
        if(p.getName().length()>30){
            throw new RuntimeException("Length of name must be less than 30 characters!");
        }
        ChargerCost cost = chargerCostRepository.findChargerCostByPortType(p.getPortType());
        c.setName(p.getName());
        c.setCapacity(getCapacity(p.getPortType()));
        c.setChargerCost(cost);
        c.setStatus(p.getStatus());
        return chargerPointRepository.save(c);
    }

    public List<ChargerPoint> getAllByStation(int stationId){
        List<ChargerPoint> list = new ArrayList<>();
        chargerPointRepository.findChargerPointsByStationId(stationId).forEach(list::add);
        return list;
    }

    public ChargerPoint get(int id){
        return chargerPointRepository.findChargerPointById(id);
    }
}
