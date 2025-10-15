package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.Car;
import com.ev.evchargingsystem.entity.ChargerPoint;
import com.ev.evchargingsystem.entity.ChargingSession;
import com.ev.evchargingsystem.model.request.ChargingSessionRequest;
import com.ev.evchargingsystem.model.response.ChargingResponse;
import com.ev.evchargingsystem.repository.CarRepository;
import com.ev.evchargingsystem.repository.ChargerPointRepository;
import com.ev.evchargingsystem.repository.ChargingSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ChargingSessionService {

    @Autowired
    ChargingSessionRepository chargingSessionRepository;
    @Autowired
    CarRepository carRepository;
    @Autowired
    ChargerPointRepository chargerPointRepository;

//    public ChargingResponse charge(ChargingSessionRequest rq) {
//        ChargingSession charge = createSession(rq);
//        ChargingResponse c = new ChargingResponse();
//
//    }

//    @Scheduled(fixedRate = 5000)//reload mỗi 5s
//    public void updateChargingSession(){
//        //lấy ra tất cả danh sách đang sạc
//        List<ChargingSession> charging = chargingSessionRepository.findChargingSessionByStatus("ONGOING");
//        for (ChargingSession c : charging){
//            //kiểm tra xem đã đạt được hạn mức cần sạc chưa
//            if(c.getCar().getInitBattery()==c.)
//        }
//    }

    public ChargingSession createSession(ChargingSessionRequest rq) {
        Car car = carRepository.findById(rq.getCarId()).orElse(null);
        ChargerPoint point = chargerPointRepository.findById(rq.getPointId()).orElse(null);
        if(car==null||point==null){
            throw new RuntimeException("Not found");
        }
        Date current = new Date(System.currentTimeMillis());
        ChargingSession charge = new ChargingSession();
        charge.setCar(car);
        charge.setStartTime(current);
        //time cần phải sạc
        int timeCharge = caculateTimeToReachGoalBattery(point.getChargerCost().getPortType(),
                car.getInitBattery(),rq.getGoalBattery());
        //đổi sang mili giây
        charge.setEndTime(new Date(current.getTime() + timeCharge*60*1000));
        charge.setPaymentMethod(rq.getPaymentMethod());
        //nếu CASH thì set trạng thái về WAITING TO PAY
        if(rq.getPaymentMethod().equals("CASH")){
            charge.setStatus("WAITING_TO_PAY");
        }
        if(rq.getPaymentMethod().equals("BALANCE")){
            charge.setStatus("ONGOING");
        }
        charge.setChargerPoint(point);
        return chargingSessionRepository.save(charge);
    }

    public int caculateTimeToReachGoalBattery(String portType, int initBattery, int goalBattery){
        int needCharge = goalBattery - initBattery;//% cần sạc
        if(needCharge<=0)return 0;
        //mất 1,8p để sạc được 1%
        if(portType.equals("AC")){
            return (int)Math.round(needCharge*1.8);
        }
        //mất 0.8p để sạc được 1%
        if(portType.equals("CHAdeMO")){
            return (int)Math.round(needCharge*0.8);
        }
        //mất 0.3p để sạc được 1%
        if(portType.equals("CCS")){
            return (int)Math.round(needCharge*0.3);
        }
        return 0;
    }
}
