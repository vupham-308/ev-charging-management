package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.Staff;
import com.ev.evchargingsystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff,Integer> {

    List<Staff> findStaffsByStationId(int stationID);

    Optional<Staff> findByUserEmail(String email);

    Staff findStaffByUser(User user);

    void deleteByUser(User user);


}
