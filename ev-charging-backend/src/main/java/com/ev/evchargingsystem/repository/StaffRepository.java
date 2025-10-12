package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StaffRepository extends JpaRepository<Staff,Integer> {

    List<Staff> findStaffsByStationId(int stationID);
}
