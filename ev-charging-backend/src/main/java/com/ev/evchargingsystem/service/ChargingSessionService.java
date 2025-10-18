package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.*;
import com.ev.evchargingsystem.model.request.ChargingSessionRequest;
import com.ev.evchargingsystem.model.response.ChargingResponse;
import com.ev.evchargingsystem.repository.CarRepository;
import com.ev.evchargingsystem.repository.ChargerPointRepository;
import com.ev.evchargingsystem.repository.ChargingSessionRepository;
import com.ev.evchargingsystem.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
    @Autowired
    TransactionService transactionService;
    @Autowired
    private TransactionRepository transactionRepository;


    public ChargingSession charge(int sessionId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ChargingSession c = chargingSessionRepository.findChargingSessionById(sessionId);
        if(c.getStatus().equals("COMPLETED")) {
            throw new RuntimeException("Phiên sạc đã hoàn thành");
        }
        int time = caculateTimeToReachGoalBattery(c.getChargerPoint().getChargerCost().getPortType(),
                c.getCar().getInitBattery(),c.getGoalBattery());
        double total = time*c.getChargerPoint().getChargerCost().getCost();
        //nếu CASH thì check xem KH đã thanh toán chưa
        if(c.getPaymentMethod().equals("CASH")&&c.getStatus().equals("WAITING_TO_PAY")){
            throw new RuntimeException("Vui lòng liên hệ nhân viên thanh toán để tiếp tục!");
        }
        //BALANCE thì lưu vào transaction
        if(c.getPaymentMethod().equals("BALANCE")){
            Transaction t = transactionService.createTransaction(c,total);
        }
        //CASH + PAID thì lưu vào transaction
        if(c.getPaymentMethod().equals("CASH")&&c.getStatus().equals("PAID")){
            Transaction t = transactionService.createTransaction(c,total);
        }
        c.setStatus("ONGOING");
        c.getChargerPoint().setStatus("OCCUPIED");
        chargerPointRepository.save(c.getChargerPoint());
        return chargingSessionRepository.save(c);
    }

    @Scheduled(fixedRate = 18000)//reload mỗi 18s
    public void updateChargingSessionCCS(){
        //lấy ra tất cả danh sách đang sạc
        List<ChargingSession> charging = chargingSessionRepository.findChargingSessionByStatus("ONGOING");
        List<ChargingSession> ccs = new ArrayList<>();
        for (ChargingSession c : charging){
            //lấy danh sách portType CCS
            String portType = c.getChargerPoint().getChargerCost().getPortType();
            if(portType.equalsIgnoreCase("CCS")){
                 ccs.add(c);
            }
        }
        for(ChargingSession list : ccs){
            //18s tăng 1%
            list.getCar().setInitBattery(list.getCar().getInitBattery()+1);
            if(list.getCar().getInitBattery()>=list.getGoalBattery()){
                list.setStatus("COMPLETED");
                list.getChargerPoint().setStatus("AVAILABLE");
                list.setEndTime(new Date(System.currentTimeMillis()));
            }
            chargerPointRepository.save(list.getChargerPoint());
            chargingSessionRepository.save(list);
            carRepository.save(list.getCar());
        }
    }

    @Scheduled(fixedRate = 48000)//reload mỗi 48s
    public void updateChargingSessionCHAdeMO(){
        //lấy ra tất cả danh sách đang sạc
        List<ChargingSession> charging = chargingSessionRepository.findChargingSessionByStatus("ONGOING");
        List<ChargingSession> cha = new ArrayList<>();
        for (ChargingSession c : charging){
            //lấy danh sách portType CHAdeMO
            String portType = c.getChargerPoint().getChargerCost().getPortType();
            if(portType.equalsIgnoreCase("CHAdeMO")){
                cha.add(c);
            }
        }
        for(ChargingSession list : cha){
            //48s tăng 1%
            list.getCar().setInitBattery(list.getCar().getInitBattery()+1);
            if(list.getCar().getInitBattery()>=list.getGoalBattery()){
                list.setStatus("COMPLETED");
                list.getChargerPoint().setStatus("AVAILABLE");
                list.setEndTime(new Date(System.currentTimeMillis()));
            }
            chargerPointRepository.save(list.getChargerPoint());
            chargingSessionRepository.save(list);
            carRepository.save(list.getCar());
        }
    }

    @Scheduled(fixedRate = 108000)//reload mỗi 1,8p=108s
    public void updateChargingSessionAC(){
        //lấy ra tất cả danh sách đang sạc
        List<ChargingSession> charging = chargingSessionRepository.findChargingSessionByStatus("ONGOING");
        List<ChargingSession> ac = new ArrayList<>();
        for (ChargingSession c : charging){
            //lấy danh sách portType AC
            String portType = c.getChargerPoint().getChargerCost().getPortType();
            if(portType.equalsIgnoreCase("AC")){
                ac.add(c);
            }
        }
        for(ChargingSession list : ac){
            //108s tăng 1%
            list.getCar().setInitBattery(list.getCar().getInitBattery()+1);
            if(list.getCar().getInitBattery()>=list.getGoalBattery()){
                list.setStatus("COMPLETED");
                list.getChargerPoint().setStatus("AVAILABLE");
                list.setEndTime(new Date(System.currentTimeMillis()));
            }
            chargerPointRepository.save(list.getChargerPoint());
            chargingSessionRepository.save(list);
            carRepository.save(list.getCar());
        }
    }

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
        //time cần phải sạc (phút)
        int timeCharge = caculateTimeToReachGoalBattery(point.getChargerCost().getPortType(),
                car.getInitBattery(),rq.getGoalBattery());
        //đổi sang mili giây
        charge.setEndTime(new Date(current.getTime() + timeCharge*60*1000));
        charge.setPaymentMethod(rq.getPaymentMethod());
        //set trạng thái về WAITING TO PAY
        charge.setStatus("WAITING_TO_PAY");
        charge.setChargerPoint(point);
        if(rq.getGoalBattery()<=car.getInitBattery()){
            throw new RuntimeException("Không thể sạc với mục tiêu sạc thấp hơn pin của bạn!");
        }
        charge.setGoalBattery(rq.getGoalBattery());
        return chargingSessionRepository.save(charge);
        //======================================
//        //trả về ChargingResponse
//        ChargingResponse rs = new ChargingResponse();
//        rs.setFee(timeCharge*charge.getChargerPoint().getChargerCost().getCost());
//        rs.setMinute(timeCharge);
//        rs.setGoalBattery(charge.getGoalBattery());
//        rs.setInitBattery(charge.getCar().getInitBattery());
//        rs.setPoint(charge.getChargerPoint());
//        rs.setPaymentMethod(charge.getPaymentMethod());
//        rs.setCarName(charge.getCar().getBrand());
//        return rs;
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

    public List<ChargingResponse> view() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<ChargingSession> list = chargingSessionRepository.findOngoingSessionsByUser(user.getId());
        List<ChargingResponse> rsList = new ArrayList<>();
        for(ChargingSession c : list) {
            int time = caculateTimeToReachGoalBattery(c.getChargerPoint().getChargerCost().getPortType(),
                    c.getCar().getInitBattery(), c.getGoalBattery());
            double total = 0;
            ChargingResponse rs = new ChargingResponse(c.getChargerPoint(),
                    c.getCar().getBrand(), c.getPaymentMethod(), time, total,
                    c.getCar().getInitBattery(), c.getGoalBattery());
            rsList.add(rs);
        }
        return rsList;
    }

    public boolean stopCharge(int sessionId){
        ChargingSession s = chargingSessionRepository.findChargingSessionById(sessionId);
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(user.getRole().equals("USER")&&(s.getCar().getUser().getId()!=user.getId())){
            throw new RuntimeException("Bạn không có quyền dừng phiên sạc này!");
        }

        //sửa lại thông tin session thực tế
        s.setEndTime(new Date(System.currentTimeMillis()));
        s.setStatus("COMPLETED");
        chargingSessionRepository.save(s);
        //sửa transaction mới tương ứng
        Transaction tranNew = transactionRepository.findTransactionByChargingSession(s);
        Date current = new Date(System.currentTimeMillis());
        int timeCharged = (int) (current.getTime()-s.getStartTime().getTime())/36000;
        double total = timeCharged*s.getChargerPoint().getChargerCost().getCost();
        tranNew.setTotalAmount(total);
        transactionRepository.save(tranNew);
        return true;
    }
}
