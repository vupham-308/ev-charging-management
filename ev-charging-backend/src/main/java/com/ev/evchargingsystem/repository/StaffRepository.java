package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.Staff;
import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.model.response.StaffStationResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, Integer> {

    List<Staff> findStaffsByStationId(int stationID);

    Optional<Staff> findByUserEmail(String email);

    Staff findStaffByUser(User user);

    void deleteByUser(User user);

    Optional<Staff> findByUserId(Integer userId);

    @Query("""
            SELECT new com.ev.evchargingsystem.model.response.StaffStationResponse(
                u.id,                  
                u.fullName,
                COALESCE(s.name, 'chưa có')
            )
            FROM Staff st
            JOIN st.user u
            LEFT JOIN st.station s
            """)
    List<StaffStationResponse> findAllStaffWithStation();
}
