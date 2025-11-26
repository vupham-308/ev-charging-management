package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.ChargerPoint;
import com.ev.evchargingsystem.entity.ChargingSession;
import com.ev.evchargingsystem.entity.Reservation;
import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.model.request.ReservationRequest;
import com.ev.evchargingsystem.model.response.ReservationResponse;
import com.ev.evchargingsystem.repository.ChargerPointRepository;
import com.ev.evchargingsystem.repository.ReservationRepository;
import com.ev.evchargingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class ReservationService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ChargerPointRepository chargerPointRepository;
    @Autowired
    private ReservationRepository reservationRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng hiện tại"));
    }

    public String createReservation(String email, ReservationRequest request) {

        Optional<User> optionalUser = userRepository.findByEmail(email);
        User user = optionalUser.get();

        // Kiểm tra nếu user có reservation chưa hoàn tất
        List<Reservation> activeReservations = reservationRepository.findByUserId(user.getId());
        for (Reservation r : activeReservations) {
            if (!"COMPLETED".equalsIgnoreCase(r.getStatus()) && !"CANCELLED".equalsIgnoreCase(r.getStatus())) {
                throw new RuntimeException("Bạn đang có một đặt chỗ chưa hoàn tất. Vui lòng hoàn tất trước khi đặt mới.");
            }
        }

        //Lấy trụ sạc
        ChargerPoint cp = chargerPointRepository.findChargerPointById(request.getChargerPointId());

        //Trụ phải đang AVAILABLE mới cho đặt
        if (!"AVAILABLE".equalsIgnoreCase(cp.getStatus())) {
            throw new RuntimeException("This charger point is not available");
        }

        //Validate thời gian
        Date start = request.getStartDate();
        Date end = request.getEndDate();
        Date current = new Date(System.currentTimeMillis());

        if (start == null || end == null) {
            throw new RuntimeException( "Thời gian bắt đầu và kết thúc không được để trống");
        }
        if (current.after(start)) {
            throw new RuntimeException("Thời gian đặt chỗ phải ở tương lai");
        }
        if (end.before(start)) {
            throw new RuntimeException( "Thời gian kết thúc phải sau thời gian bắt đầu");
        }
        long durationMillis = end.getTime() - start.getTime();
        if (durationMillis > 30 * 60 * 1000L) { // tối đa 30m
            throw new RuntimeException("Chỉ có thể đặt chỗ trong tối đa 30 phút");
        }

        // Không cho đặt ở quá khứ
        Date now = new Date();
        if (end.before(now)) {
            throw new RuntimeException( "Thời gian đặt chỗ phải ở tương lai");
        }

        //kiểm tra trùng lặp với các reservation khác
        List<Reservation> existingReservations = reservationRepository.findByChargerPointIdAndStatus(cp.getId(), "PENDING");
        for (Reservation r : existingReservations) {
            if (start.before(r.getEndDate()) && end.after(r.getStartDate())) {
                throw new RuntimeException("Khung giờ này đã được đặt trước!");
            }
        }

        //Tạo reservation
        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setChargerPoint(cp);
        reservation.setStartDate(start);
        reservation.setEndDate(end);
        reservation.setStatus("PENDING");
        reservationRepository.save(reservation);


        return "Reservation successful";
    }

    @Scheduled(fixedRate = 10000)//chạy mỗi 10s
    public void setStatusRever(){
        List<Reservation> reservations = reservationRepository.findByStatus("PENDING");
        Date current = new Date(System.currentTimeMillis());
        for(Reservation r: reservations){//đúng giờ tự lock trụ
            if(current.after(r.getStartDate())&&r.getEndDate().after(current)) {
                //TH1: trụ trống hoàn toàn, có thể lock trụ
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
                //if(!r.getChargerPoint().equals("ONGOING")) {
                if (!"ONGOING".equalsIgnoreCase(r.getChargerPoint().getStatus())) {
                    r.getChargerPoint().setStatus("AVAILABLE");}
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
                dto.setChargerpointId(r.getChargerPoint().getId());
                if (r.getChargerPoint().getStation() != null) {
                    dto.setStationName(r.getChargerPoint().getStation().getName());
                    dto.setStationId(r.getChargerPoint().getStation().getId());
                }
            }
            result.add(dto);
        }
        return result;
    }


    public void cancelReservation(int reservationId) {
        User currentUser = getCurrentUser();
        Reservation reservation = reservationRepository.findById(reservationId).get();

        if(currentUser.getRole().equals("USER")) {
            reservation = reservationRepository.findByIdAndUserId(reservationId, currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt chỗ của bạn với ID: " + reservationId));
        }

        if (reservation.getStatus().equalsIgnoreCase("CANCELLED") ||
                reservation.getStatus().equalsIgnoreCase("COMPLETED")) {
            throw new RuntimeException("Không thể hủy đặt chỗ");
        }

        reservation.setStatus("CANCELLED");
        ChargerPoint p = reservation.getChargerPoint();
        if(p.getStatus().equals("RESERVED")) {
            p.setStatus("AVAILABLE");
            chargerPointRepository.save(p);
        }
        reservationRepository.save(reservation);
    }

    public List<ReservationResponse> getAllReservations() {
        List<ReservationResponse> result = new ArrayList<>();
        List<Reservation> reservations = reservationRepository.findAllByStatus("PENDING");
        for(Reservation r: reservations){
            ReservationResponse dto = new ReservationResponse();
            dto.setId(r.getId());
            dto.setStatus(r.getStatus());
            dto.setStartDate(r.getStartDate());
            dto.setEndDate(r.getEndDate());

            // Lấy tên trụ và trạm
            if (r.getChargerPoint() != null) {
                dto.setChargerPointName(r.getChargerPoint().getName());
                dto.setChargerpointId(r.getChargerPoint().getId());
                if (r.getChargerPoint().getStation() != null) {
                    dto.setStationName(r.getChargerPoint().getStation().getName());
                    dto.setStationId(r.getChargerPoint().getStation().getId());
                }
            }
            result.add(dto);
        }
        return result;
    }

    public Reservation getByStationId(int id){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Reservation> res = reservationRepository.findPendingReservationByUserAndStation(user.getId(),id);
        if(!res.isEmpty()){
            return res.get(0);
        }
        return null;
    }
}
