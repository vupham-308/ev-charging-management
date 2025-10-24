package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.*;
import com.ev.evchargingsystem.model.request.ChargingSessionRequest;
import com.ev.evchargingsystem.model.response.ChargingResponse;
import com.ev.evchargingsystem.repository.*;
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
    @Autowired
    StaffRepository staffRepository;
    @Autowired
    ReservationRepository reservationRepository;


    public ChargingSession charge(int sessionId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ChargingSession c = chargingSessionRepository.findChargingSessionById(sessionId);
        if(c.getStatus().equals("COMPLETED")) {
            throw new RuntimeException("Phiên sạc đã hoàn thành");
        }
        //nếu CASH thì check xem KH đã thanh toán chưa
        if(c.getPaymentMethod().equals("CASH")&&c.getStatus().equals("WAITING_TO_PAY")){
            throw new RuntimeException("Vui lòng liên hệ nhân viên thanh toán để tiếp tục!");
        }
        //BALANCE thì lưu vào transaction
        //CASH + PAID thì lưu vào transaction thành complete
            Transaction t = transactionRepository.findTransactionByChargingSessionId(c.getId());
            transactionService.setComplete(t);
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

    public ChargingResponse createSession(ChargingSessionRequest rq) {
        Car car = carRepository.findById(rq.getCarId()).orElse(null);
        User user = car.getUser();
        ChargerPoint point = chargerPointRepository.findById(rq.getPointId()).orElse(null);
        if(car==null||point==null){
            throw new RuntimeException("Not found");
        }
        ChargingSession charge = new ChargingSession();
        //kiểm tra xem xe này có đang được sạc không, nếu xe đang có 1 phiên sạc khác thì báo lỗi
        List<ChargingSession> s = chargingSessionRepository.findChargingSessionByCar(car);
        for(ChargingSession x: s) {
            if (x != null && x.getStatus().equals("ONGOING")) {
                throw new RuntimeException("Đang có 1 phiên sạc khác với xe này. Vui lòng kiểm tra lại!");
            }
        }
        Date current = new Date(System.currentTimeMillis());
        //time cần phải sạc (phút)
        int timeCharge = caculateTimeToReachGoalBattery(point.getChargerCost().getPortType(),
                car.getInitBattery(),rq.getGoalBattery());
        //đổi sang mili giây
        charge.setEndTime(new Date(current.getTime() + timeCharge*60*1000));
        double fee = timeCharge*point.getChargerCost().getCost();
        //check trạng thái trụ sạc
        if(!point.getStatus().equals("AVAILABLE")){
            throw new RuntimeException("Trụ sạc không khả dụng");
        }
        //nếu create 1 trụ sạc đang ở trạng thái RESERVED, cần kiểm tra xem
        //có đúng user đang tạo session này đã đặt chỗ không
        boolean check = true;//nếu nó không phải là RESERVED thì bỏ qua code dưới
        if(point.getStatus().equals("RESERVED")){
            check=false;
            List<Reservation> r = reservationRepository.findByUserIdAndStatus(user.getId(),"PENDING");
            for(Reservation x: r){
                if(x.getChargerPoint().getId()==charge.getChargerPoint().getId()){
                    check = true;
                }
            }
        }
        if(!check){
            throw new RuntimeException("Trụ sạc này đang được đặt trước bởi 1 người khác.");
        }
        //check pin
        if(rq.getGoalBattery()<=car.getInitBattery()){
            throw new RuntimeException("Không thể sạc với mục tiêu sạc thấp hơn pin của bạn!");
        }
        charge.setCar(car);
        charge.setChargerPoint(point);
        charge.setStartTime(current);
        charge.setGoalBattery(rq.getGoalBattery());
        charge.setPaymentMethod(rq.getPaymentMethod());
        charge.setStatus("WAITING_TO_PAY");
        chargingSessionRepository.save(charge);
        transactionService.createTransaction(charge,fee);

        //=====================
        //Map từ ChargingSession về ChargingResponse
        return new ChargingResponse(charge.getId(),charge.getChargerPoint(),charge.getCar(),
                charge.getPaymentMethod(),charge.getStatus(),timeCharge,fee,charge.getCar().getInitBattery(),
                charge.getGoalBattery(),charge.getStartTime());
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
        Transaction t;
        for(ChargingSession c : list) {
            int time = caculateTimeToReachGoalBattery(c.getChargerPoint().getChargerCost().getPortType(),
                    c.getCar().getInitBattery(), c.getGoalBattery());
            t = transactionRepository.findTransactionByChargingSessionId(c.getId());
            double total = t.getTotalAmount();
            ChargingResponse rs = new ChargingResponse(c.getId(),c.getChargerPoint(),
                    c.getCar(), c.getPaymentMethod(),c.getStatus(), time, total,
                    c.getCar().getInitBattery(), c.getGoalBattery(),c.getStartTime());
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
        //sửa lại trạng thái cua trụ sạc về Available
        s.getChargerPoint().setStatus("AVAILABLE");
        chargerPointRepository.save(s.getChargerPoint());
        //sửa transaction mới tương ứng
        Transaction tranNew = transactionRepository.findTransactionByChargingSessionId(s.getId());
        Date current = new Date(System.currentTimeMillis());
        int timeCharged = (int) (current.getTime()-s.getStartTime().getTime())/36000;
        double total = timeCharged*s.getChargerPoint().getChargerCost().getCost();
        tranNew.setTotalAmount(total);
        transactionRepository.save(tranNew);
        return true;
    }

    public List<ChargingResponse> getAllByStaff() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Staff staff = staffRepository.findStaffByUser(user);
        Station s = staff.getStation();
        List<ChargingSession> list = chargingSessionRepository.findChargingSessionByStationId(s.getId());
        List<ChargingResponse> rsList = new ArrayList<>();
        Transaction tranNew=null;
        for(ChargingSession x: list){
            tranNew = transactionRepository.findTransactionByChargingSessionId(x.getId());
            //thời gian còn lại để sạc đến goal
            int minute = caculateTimeToReachGoalBattery(x.getChargerPoint().getChargerCost().getPortType(),
                    x.getCar().getInitBattery(), x.getGoalBattery());
            rsList.add(new ChargingResponse(x.getId(),x.getChargerPoint(),
                    x.getCar(),x.getPaymentMethod(),x.getStatus(),minute,
                    tranNew.getTotalAmount(),x.getCar().getInitBattery(),x.getGoalBattery(),x.getStartTime()));
        }
        return rsList;
    }

    public ChargingSession payByCash(int sessionId) {
        ChargingSession s = chargingSessionRepository.findChargingSessionById(sessionId);
        s.setStatus("PAID");
        if(s==null) throw new RuntimeException("Không tìm thấy SessionID!");
        return chargingSessionRepository.save(s);
    }
}
