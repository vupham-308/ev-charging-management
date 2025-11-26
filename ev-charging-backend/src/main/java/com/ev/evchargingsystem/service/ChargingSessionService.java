package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.*;
import com.ev.evchargingsystem.model.request.ChargingSessionRequest;
import com.ev.evchargingsystem.model.response.ChargingResponse;
import com.ev.evchargingsystem.repository.*;
import jakarta.mail.MessagingException;
import org.apache.commons.lang3.RandomUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

@Service
public class ChargingSessionService {

    @Autowired
    private ChargingSessionRepository chargingSessionRepository;
    @Autowired
    private CarRepository carRepository;
    @Autowired
    private ChargerPointRepository chargerPointRepository;
    @Autowired
    private TransactionService transactionService;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private StaffRepository staffRepository;
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private EmailService emailService;

    private SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");

    public ChargingSession charge(int sessionId) throws MessagingException {
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
        //nếu trụ đang ở RESERVED, thì link session này với Reservation đó\
        if(c.getChargerPoint().getStatus().equals("RESERVED")) {
            List<Reservation> r = reservationRepository.findByUserIdAndStatus(user.getId(), "PENDING");
            Reservation re = null;
            if (!r.isEmpty()) {
                re = r.get(0);//vì mỗi người chỉ có 1 Reservation PENDING duy nhất
            }
            if (re != null && re.getChargerPoint().getId() == c.getChargerPoint().getId()) {
                c.setReservation(re);
                c.getReservation().setStatus("COMPLETED");
                reservationRepository.save(c.getReservation());
            }
        }
        c.getChargerPoint().setStatus("OCCUPIED");
        chargerPointRepository.save(c.getChargerPoint());
        c.setStartTime(new Date());
        int minutes = getEstimateTime(c.getCar().getInitBattery(),c.getGoalBattery(),c.getChargerPoint(),c.getCar());
        c.setEndTime(new Date(new Date().getTime() + minutes * 60 * 1000));//dự kiến

        sendEmailIfHaveSession(c);

        return chargingSessionRepository.save(c);
    }

    @Scheduled(fixedRate = 5000)
    public void chargeSchedule(){
        List<ChargingSession> charging = chargingSessionRepository.findChargingSessionByStatus("ONGOING");
        for(ChargingSession c : charging) {
            int random = RandomUtils.nextInt(80, 95);
            double powerRealTime = c.getChargerPoint().getChargerCost().getPower() * random / 100;
            c.getChargerPoint().setPowerRealTime(powerRealTime);
            //1h             7kW            sạc được 7kWh
            //5s=1/720h  powerRealTime      sạc được ? kWh
            double charge = powerRealTime/720;
            c.getCar().setInitBattery(c.getCar().getInitBattery()+charge);
            if(c.getGoalBattery()<=c.getCar().getInitBattery()) {
                c.getCar().setInitBattery(c.getGoalBattery());
                c.setStatus("COMPLETED");
                c.setEndTime(new Date());
                c.getChargerPoint().setStatus("AVAILABLE");
                c.getChargerPoint().setPowerRealTime(null);
            }
            chargerPointRepository.save(c.getChargerPoint());
            carRepository.save(c.getCar());
            chargingSessionRepository.save(c);
        }

    }

    //30p trước giờ đặt, gửi mail thông báo nếu có người đặt
    //sạc xe trùng với thời gian đặt chỗ
    public void sendEmailIfHaveSession(ChargingSession chargingSession) throws MessagingException {
        Date current = new Date(System.currentTimeMillis());
        List<Reservation> reservations = reservationRepository.findAll().stream()
                .filter(reservation -> reservation.getStatus().equals("PENDING"))
                .filter(reservation -> reservation.getChargerPoint().getId()==chargingSession.getChargerPoint().getId())
                .filter(reservation -> reservation.getStartDate().getDate() == current.getDate()&&
                        reservation.getStartDate().getMonth() == current.getMonth()&&
                        reservation.getStartDate().getYear()==current.getYear())
                .toList();
        for(Reservation r: reservations){
            Date thirty = new Date(r.getStartDate().getTime() - 30*60*1000);
            if(thirty.before(current)&&
                    r.getStartDate().after(current)&&
                    chargingSession.getEndTime().after(r.getStartDate())){
                String template = emailService.loadTemplate("mail/ReservationNoti.html");
                String html = template
                        .replace("{{userName}}",r.getUser().getFullName())
                        .replace("{{stationName}}",r.getChargerPoint().getStation().getName())
                        .replace("{{chargerPoint}}",r.getChargerPoint().getName())
                        .replace("{{reservationStartTime}}", sdf.format(r.getStartDate()))
                        .replace("{{reservationEndTime}}",sdf.format(r.getEndDate()))
                        .replace("{{endTime}}",sdf.format(chargingSession.getEndTime()));
                emailService.sendMail(r.getUser().getEmail(),"EV Charging: Cảnh báo trùng lịch sạc",html);
            }
        }
    }

    public ChargingResponse createSession(ChargingSessionRequest rq) {
        Car car = carRepository.findById(rq.getCarId()).orElse(null);
        User user = car.getUser();
        ChargerPoint point = chargerPointRepository.findById(rq.getPointId()).orElse(null);
        //===============VALIDATION===========================
        if(car==null||point==null){
            throw new RuntimeException("Not found");
        }

        //check trạng thái trụ sạc
        if(point.getStatus().equals("OCCUPIED")||point.getStatus().equals("OUT_OF_SERVICE")){
            throw new RuntimeException("Trụ sạc không khả dụng");
        }

        // hàm kiểm tra tương thích brand–connector
        validateConnectorCompatibility(
                car,
                point.getChargerCost().getPortType()
        );

        //status WAITING_TO_PAY là nháp, để tránh trùng lặp khi tạo session
        //check, nếu có thì chỉ thay đổi thông tin
        ChargingSession charge = new ChargingSession();
        List<ChargingSession> draft = chargingSessionRepository.findChargingSessionByStatus("WAITING_TO_PAY");
        if(!draft.isEmpty()){
            charge = draft.get(0);
        }
        //kiểm tra xem xe này có đang được sạc không, nếu xe đang có 1 phiên sạc khác thì báo lỗi
        List<ChargingSession> s = chargingSessionRepository.findChargingSessionByCar(car);
        for(ChargingSession x: s) {
            if (x != null && x.getStatus().equals("ONGOING")) {
                throw new RuntimeException("Đang có 1 phiên sạc khác với xe này. Vui lòng kiểm tra lại!");
            }
        }
        //nếu create 1 trụ sạc đang ở trạng thái RESERVED, cần kiểm tra xem
        //có đúng user đang tạo session này đã đặt chỗ không
        boolean check = true;//nếu nó không phải là RESERVED thì bỏ qua code dưới
        if(point.getStatus().equals("RESERVED")){
            check=false;
            List<Reservation> r = reservationRepository.findByUserIdAndStatus(user.getId(),"PENDING");
            for(Reservation x: r){
                if(x.getChargerPoint().getId()== rq.getPointId()){
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
        //===============LOGIC===========================
        charge.setCar(car);
        charge.setChargerPoint(point);
        charge.setInitBattery(car.getInitBattery());
        //kWh cần sạc
        double goalBattery = rq.getGoalBattery()*car.getCarBranch().getBatteryCapacity()/100;//kWh mục tiêu
        charge.setGoalBattery(goalBattery);
        //giá tiền ucows tính
        double estimateFee = getFeeCharge(charge.getInitBattery(),charge.getGoalBattery(),point);

        //100%    batteryCapacityNeedToCharge
        //20/7h                  ?               ( thời gian để sạc đến mục tiêu)
        //=> Thời gian để sạc được đến goal = batteryCapacityNeedToCharge*(20/7)/100
        //Điều kiện lý tưởng: công suất của trụ sạc luôn đạt max (=7)
        //Thực tế: công suất sạc chỉ được khoảng 80-95%, phụ thuộc vào SoH, nhiệt độ pin

        int minutes = getEstimateTime(charge.getCar().getInitBattery(),goalBattery,point,car);
        //đổi sang phần trăm
        int initBatteryPercent= (int) Math.round(charge.getInitBattery()/charge.getCar().getCarBranch().getBatteryCapacity()*100);
        int goalBatteryPercent= (int) Math.round(charge.getGoalBattery()/charge.getCar().getCarBranch().getBatteryCapacity()*100);

        charge.setPaymentMethod(rq.getPaymentMethod());
        charge.setStatus("WAITING_TO_PAY");
        chargingSessionRepository.save(charge);
        transactionService.createTransaction(charge,estimateFee);

        //=====================
        //Map từ ChargingSession về ChargingResponse
        return new ChargingResponse(charge.getId(),charge.getChargerPoint(),charge.getCar(),
                charge.getPaymentMethod(),charge.getStatus(),minutes,estimateFee,initBatteryPercent, goalBatteryPercent);
    }


    public int getEstimateTime(double initBattery, double goalBattery,ChargerPoint point,Car car){
        double batteryCapacityNeedToCharge = goalBattery-initBattery;
        //Thực tế: công suất sạc chỉ được khoảng 80-95%, phụ thuộc vào SoH, nhiệt độ pin
        //thời gian ước tính sạc đầy, lấy mức 87% công suất lý tưởng để ước tính
        //công suất thực tế ước tính (87%)
        //1h   trụ 50kW sạc được 50kWh
        //1h   trụ 0.87*50kW sạc được 0,87*50kWh
        //0,367h trụ 0.87*50kW sạc được 18.35kW (vf3)
        //?h   trụ 0.87*50kW sạc được ? kWh
        //=>hour = kWh của xe * 1 /(0.87*power of charger)
        double powerEstimate = 0.87*point.getChargerCost().getPower();
        double hours = batteryCapacityNeedToCharge/powerEstimate;
        //=> thời gian ước tính dựa trên công suất thực tế (87%)
        return (int) (hours * 60 + 1);//tránh để số 0
        //=> thời gian để sạc đến goal (phút)
    }

    public double getFeeCharge(double initBattery, double goalBattery,ChargerPoint point){
        double batteryCapacityNeedToCharge = goalBattery-initBattery;
        //giá tiền cần trả
        return Math.round(batteryCapacityNeedToCharge*point.getChargerCost().getCost());
    }

    public List<ChargingResponse> view() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<ChargingSession> list = chargingSessionRepository.findSessionFilterTwoStatusByUser(user.getId(),"ONGOING","COMPLETED");
        List<ChargingResponse> rsList = new ArrayList<>();
        for(ChargingSession c : list) {
            int estimateTimeRemain = getEstimateTime(c.getCar().getInitBattery(), c.getGoalBattery(), c.getChargerPoint(), c.getCar());
            int currentBatteryPercent = (int) Math.round(c.getCar().getInitBattery() / c.getCar().getCarBranch().getBatteryCapacity() * 100);
            double feeCharged = getFeeCharge(c.getInitBattery(),c.getCar().getInitBattery(),c.getChargerPoint());
            double estimateFee = getFeeCharge(c.getInitBattery(),c.getGoalBattery(),c.getChargerPoint());
            double energyDeliverd = c.getCar().getInitBattery()-c.getInitBattery();
            int initBatteryPercent= (int) Math.round(c.getInitBattery()/c.getCar().getCarBranch().getBatteryCapacity()*100);
            int goalBatteryPercent= (int) Math.round(c.getGoalBattery()/c.getCar().getCarBranch().getBatteryCapacity()*100);
            long durationMs = System.currentTimeMillis() - c.getStartTime().getTime();
            if(c.getStatus().equals("COMPLETED")){
                estimateTimeRemain = 0;
                durationMs=c.getEndTime().getTime() - c.getStartTime().getTime();
                Transaction t = transactionRepository.findTransactionByChargingSessionId(c.getId());
                feeCharged = t.getTotalAmount();
                energyDeliverd = c.getGoalBattery()-c.getInitBattery();
            }
            int duration = (int) Math.round(durationMs / (1000 * 60));//phút
            ChargingResponse r = new ChargingResponse(c.getId(),c.getChargerPoint(),c.getCar(),
                    c.getPaymentMethod(),c.getStatus(),estimateTimeRemain,feeCharged,estimateFee,energyDeliverd,initBatteryPercent,
                    goalBatteryPercent,currentBatteryPercent,c.getStartTime(),c.getEndTime(),duration);
            rsList.add(r);
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
        s.setGoalBattery(s.getCar().getInitBattery());
        s.setStatus("COMPLETED");
        chargingSessionRepository.save(s);
        //sửa lại trạng thái cua trụ sạc về Available
        s.getChargerPoint().setStatus("AVAILABLE");
        s.getChargerPoint().setPowerRealTime(null);
        chargerPointRepository.save(s.getChargerPoint());
        //sửa transaction mới tương ứng
        Transaction tranNew = transactionRepository.findTransactionByChargingSessionId(s.getId());

        //nếu kh chọn cash thì không cập nhật giá tiền mới

        //tính lại tổng tiền dựa trên thời gian sạc thực tế
        if(!tranNew.getPaymentMethod().equals("CASH")) {
            double charged = s.getGoalBattery() - s.getInitBattery();
            double total = s.getChargerPoint().getChargerCost().getCost() * charged;
            tranNew.setTotalAmount(total);
            transactionRepository.save(tranNew);
        }
        return true;
    }

    public List<ChargingResponse> getAllByStaff() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Staff staff = staffRepository.findStaffByUser(user);
        Station s = staff.getStation();
        List<ChargingSession> list = chargingSessionRepository.findChargingSessionByStationId(s.getId());
        List<ChargingResponse> rsList = new ArrayList<>();
        Transaction tranNew=null;
        for(ChargingSession c : list) {
            int estimateTimeRemain = getEstimateTime(c.getCar().getInitBattery(), c.getGoalBattery(), c.getChargerPoint(), c.getCar());
            int currentBatteryPercent = (int) Math.round(c.getCar().getInitBattery() / c.getCar().getCarBranch().getBatteryCapacity() * 100);
            double feeCharged = getFeeCharge(c.getInitBattery(),c.getCar().getInitBattery(),c.getChargerPoint());
            double estimateFee = getFeeCharge(c.getInitBattery(),c.getGoalBattery(),c.getChargerPoint());
            double energyDeliverd = c.getCar().getInitBattery()-c.getInitBattery();
            int initBatteryPercent= (int) Math.round(c.getInitBattery()/c.getCar().getCarBranch().getBatteryCapacity()*100);
            int goalBatteryPercent= (int) Math.round(c.getGoalBattery()/c.getCar().getCarBranch().getBatteryCapacity()*100);
            long durationMs = System.currentTimeMillis() - c.getStartTime().getTime();
            if(c.getStatus().equals("COMPLETED")){
                estimateTimeRemain = 0;
                durationMs=c.getEndTime().getTime() - c.getStartTime().getTime();
                Transaction t = transactionRepository.findTransactionByChargingSessionId(c.getId());
                feeCharged = t.getTotalAmount();
                energyDeliverd = c.getGoalBattery()-c.getInitBattery();
            }
            int duration = (int) Math.round(durationMs / (1000 * 60));//phút
            ChargingResponse r = new ChargingResponse(c.getId(),c.getChargerPoint(),c.getCar(),
                    c.getPaymentMethod(),c.getStatus(),estimateTimeRemain,feeCharged,estimateFee,energyDeliverd,initBatteryPercent,
                    goalBatteryPercent,currentBatteryPercent,c.getStartTime(),c.getEndTime(),duration);
            rsList.add(r);
        }
        return rsList;
    }

    public ChargingSession payByCash(int sessionId) {
        ChargingSession s = chargingSessionRepository.findChargingSessionById(sessionId);
        s.setStatus("PAID");
        if(s==null) throw new RuntimeException("Không tìm thấy SessionID!");
        return chargingSessionRepository.save(s);
    }

    //check cổng sạc phù hợp với xe
    private void validateConnectorCompatibility(Car car, String connectorType) {

        if (!car.getCarBranch().getPortType().equalsIgnoreCase(connectorType)) {
            throw new RuntimeException("Xe chỉ sạc được với cổng "+car.getCarBranch().getPortType());
        }
    }

}
