package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.Staff;
import com.ev.evchargingsystem.entity.Station;
import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.model.response.StaffDashboardResponse;
import com.ev.evchargingsystem.repository.ChargingSessionRepository;
import com.ev.evchargingsystem.repository.StaffRepository;
import com.ev.evchargingsystem.repository.StationRepository;
import com.ev.evchargingsystem.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;

@Service
public class StaffService {
    @Autowired
    private StaffRepository staffRepository;
    @Autowired
    private StationRepository stationRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private ChargingSessionRepository chargingSessionRepository;

    public Staff getStaffById(int id) {
        Optional<Staff> staff = staffRepository.findById(id);
        return staff.orElse(null);
    }

    public void save(Staff staff) {
        staffRepository.save(staff);
    }

    public Staff getByEmail(String email) {
        Optional<Staff> staffOpt = staffRepository.findByUserEmail(email);
        return staffOpt.orElse(null);
    }

    public StaffDashboardResponse getTodayStats() {
        User currentUser = userService.getCurrentUser();
        Staff staff = staffRepository.findStaffByUser(currentUser);
        if (staff == null) {
            throw new RuntimeException("Không tìm thấy nhân viên");
        }

        Station station = staff.getStation();
        if (station == null) {
            throw new RuntimeException("Nhân viên chưa được gán trạm nào");
        }

        LocalDate today = LocalDate.now();
        Date start = Date.from(today.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date end = Date.from(today.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());

        double revenue = transactionRepository.sumByStationAndDateRange(station.getId(), start, end);
        long customers = chargingSessionRepository.countDistinctUserByStationAndDate(station.getId(), start, end);
        long sessions = chargingSessionRepository.countByStationAndDate(station.getId(), start, end);
        Double avgTime = chargingSessionRepository.findAverageChargingTimeByStationAndDate(station.getId(), start, end);
        String mostUsed = chargingSessionRepository.findMostUsedChargerPointByStationAndDate(station.getId(), start, end);

        return new StaffDashboardResponse(
                station.getId(),
                station.getName(),
                revenue,
                customers,
                sessions,
                avgTime != null ? avgTime : 0,
                mostUsed != null ? mostUsed : "Không có dữ liệu"
        );

    }
}
