package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.Staff;
import com.ev.evchargingsystem.entity.Station;
import com.ev.evchargingsystem.repository.StaffRepository;
import com.ev.evchargingsystem.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StaffService {
    @Autowired
    private StaffRepository staffRepository;
    @Autowired
    private StationRepository stationRepository;

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
}
