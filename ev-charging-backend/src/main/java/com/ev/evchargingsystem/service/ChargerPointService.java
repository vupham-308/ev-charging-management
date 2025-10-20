package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.*;
import com.ev.evchargingsystem.model.request.ChargerPointRequest;
import com.ev.evchargingsystem.model.response.ChargerPointStatsResponseForAdmin;
import com.ev.evchargingsystem.model.response.StaffChargerPointResponse;
import com.ev.evchargingsystem.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChargerPointService {

    @Autowired
    ChargerPointRepository chargerPointRepository;

    @Autowired
    ChargerCostRepository chargerCostRepository;

    @Autowired
    StationRepository stationRepository;
    @Autowired
    private StaffRepository staffRepository;
    @Autowired
    ChargingSessionRepository chargingSessionRepository;
    @Autowired
    ReservationRepository reservationRepository;

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

    //lấy tất cả trụ sạc đang Available của trạm sạc đó
    public List<ChargerPoint> getAllByStationAvailable(int stationId){
        List<ChargerPoint> list = new ArrayList<>();
        List<ChargerPoint> avai = new ArrayList<>();
        chargerPointRepository.findChargerPointsByStationId(stationId).forEach(list::add);
        for(ChargerPoint x: list){
            if(x.getStatus().equals("AVAILABLE")){
                avai.add(x);
            }
        }
        return avai;
    }


    public ChargerPoint get(int id){
        return chargerPointRepository.findChargerPointById(id);
    }

    public ChargerPointStatsResponseForAdmin getChargerPointStats() {
        long total = chargerPointRepository.countTotalPoints();
        long available = chargerPointRepository.countAvailablePoints();
        long occupied = chargerPointRepository.countOccupiedPoints();

        return new ChargerPointStatsResponseForAdmin(total, available, occupied);
    }


    public List<StaffChargerPointResponse> chargerPointStaff() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Staff staff = staffRepository.findStaffByUser(user);
        Station s = staff.getStation();
        List<StaffChargerPointResponse> list = new ArrayList<>();
        List<ChargerPoint> points = chargerPointRepository.findChargerPointsByStationId(s.getId());
        for(ChargerPoint p: points){
            StaffChargerPointResponse r = null;
            if(p.getStatus().equals("AVAILABLE")){
                r = new StaffChargerPointResponse(p.getId(),
                        p.getChargerCost().getPortType(), p.getCapacity(),
                        p.getChargerCost().getCost(), p.getStatus());
            }
            if(p.getStatus().equals("OCCUPIED")){
                //lấy tất cả session ONGOGING
                List<ChargingSession> ongoings = chargingSessionRepository.findChargingSessionByStatus("ONGOING");
                //tìm session theo trụ sạc
                ChargingSession cs = null;
                for(ChargingSession css : ongoings){
                    if(css.getChargerPoint().getId() == p.getId()){
                        cs = css;
                    }
                }
                r = new StaffChargerPointResponse(p.getId(),
                        p.getChargerCost().getPortType(), p.getCapacity(),
                        p.getChargerCost().getCost(), p.getStatus(),cs);
            }
            if(p.getStatus().equals("RESERVED")){
                //lấy tất cả Reservation đang PENDING
                List<Reservation> reser = reservationRepository.findByStatus("PENDING");
                //tìm reser theo trụ sạc
                Reservation rv = null;
                for(Reservation res : reser){
                    if(res.getChargerPoint().getId() == p.getId()){
                        rv = res;
                    }
                }
                r = new StaffChargerPointResponse(p.getId(),
                        p.getChargerCost().getPortType(), p.getCapacity(),
                        p.getChargerCost().getCost(), p.getStatus(),rv);
            }
            if(p.getStatus().equals("OUT_OF_SERVICE")){
                r = new StaffChargerPointResponse(p.getId(),
                        p.getChargerCost().getPortType(), p.getCapacity(),
                        p.getChargerCost().getCost(), p.getStatus());
            }
            list.add(r);
        }
        return list;
    }

    public ChargerPoint chargerPointStatus(int pointId, String status) {
        ChargerPoint p = chargerPointRepository.findChargerPointById(pointId);
        p.setStatus(status);
        return chargerPointRepository.save(p);
    }
}
