package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.ChargerPoint;
import com.ev.evchargingsystem.entity.Reservation;
import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.model.request.ReservationRequest;
import com.ev.evchargingsystem.model.response.ReservationResponse;
import com.ev.evchargingsystem.repository.ChargerPointRepository;
import com.ev.evchargingsystem.repository.ReservationRepository;
import com.ev.evchargingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ReservationService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ChargerPointRepository chargerPointRepository;
    @Autowired
    private ReservationRepository reservationRepository;

    public String createReservation(String email, ReservationRequest request) {
        // 1) Lấy user theo email từ token
        Optional<User> optionalUser = userRepository.findByEmail(email);
        User user = optionalUser.get();

        // 2) Lấy trụ sạc
        ChargerPoint cp = chargerPointRepository.findChargerPointById(request.getChargerPointId());

        // 3) Trụ phải đang AVAILABLE mới cho đặt
        if (!"AVAILABLE".equalsIgnoreCase(cp.getStatus())) {
            return "This charger point is not available";
        }

        // 4) Validate thời gian
        Date start = request.getStartDate();
        Date end = request.getEndDate();
        Date current = new Date(System.currentTimeMillis());

        if (start == null || end == null) {
            return "Thời gian bắt đầu và kết thúc không được để trống";
        }
        if (current.after(start)) {
            return "Thời gian đặt chỗ phải ở tương lai";
        }
        if (end.before(start)) {
            return "Thời gian kết thúc phải sau thời gian bắt đầu";
        }
        long durationMillis = end.getTime() - start.getTime();
        if (durationMillis > 30 * 60 * 1000L) { // tối đa 30m
            return "Chỉ có thể đặt chỗ trong tối đa 30 phút";
        }

        // (Optional) Không cho đặt ở quá khứ
        Date now = new Date();
        if (end.before(now)) {
            return "Thời gian đặt chỗ phải ở tương lai";
        }

        // 5) Tạo reservation (status = PENDING để đúng CHECK constraint)
        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setChargerPoint(cp);
        reservation.setStartDate(start);
        reservation.setEndDate(end);
        reservation.setStatus("PENDING");
        reservationRepository.save(reservation);
//
//        // 6) Đánh dấu trụ đã được giữ chỗ
//        cp.setStatus("RESERVED");
//        chargerPointRepository.save(cp);

        return "Reservation successful";
    }

    //tự động load, trước 10p trước giờ hẹn sẽ set trạng thái trụ về Reserved
    @Scheduled(fixedRate = 15000)//chạy mỗi 15s
    public void setStatusRever(){
        List<Reservation> reservations = reservationRepository.findByStatus("PENDING");
        Date current = new Date(System.currentTimeMillis());
        for(Reservation r: reservations){
            Date time=new Date(r.getStartDate().getTime()-10*1000*60);//trước 10p
            if(current.after(time)&&r.getEndDate().after(current)) {
                //TH1: trụ trống hoàn toàn, có thể lock trụ trước 10p
                if(r.getChargerPoint().getStatus().equals("AVAILABLE")) {//nếu available
                    //mới có thể lock trụ, nếu có người đang sạc thì không thể
                    r.getChargerPoint().setStatus("RESERVED");
                    chargerPointRepository.save(r.getChargerPoint());
                }
            }
            //TH2: 10p trước giờ đặt, nếu có người đang sạc trước đó thì sao?
            //Trụ sạc sẽ đang ở trạng thái Occupied
            //1)nếu phiên sạc đang sạc trước đó sạc xong TRƯỚC giờ kết
            //thúc của phiên đặt chỗ, trạng thái sẽ tự động về reserve
            //2)nếu phiên sạc đang sạc trước đó sạc xong SAU giờ kết
            //thúc của phiên đặt chỗ, đặt chỗ coi như bị hủy
            if(r.getEndDate().before(current)) {
                r.getChargerPoint().setStatus("AVAILABLE");
                r.setStatus("CANCELLED");
                reservationRepository.save(r);
                chargerPointRepository.save(r.getChargerPoint());
            }
        }
    }

    public List<ReservationResponse> getUserReservations(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return Collections.emptyList();
        }
        User user = optionalUser.get();

        List<Reservation> reservations = reservationRepository.findByUserId(user.getId());
        List<ReservationResponse> result = new ArrayList<>();

        for (Reservation r : reservations) {
            ReservationResponse dto = new ReservationResponse();
            dto.setId(r.getId());
            dto.setStatus(r.getStatus());
            dto.setStartDate(r.getStartDate());
            dto.setEndDate(r.getEndDate());

            // Lấy tên trụ và trạm
            if (r.getChargerPoint() != null) {
                dto.setChargerPointName(r.getChargerPoint().getName());
                if (r.getChargerPoint().getStation() != null) {
                    dto.setStationName(r.getChargerPoint().getStation().getName());
                }
            }
            result.add(dto);
        }
        return result;
    }
}
