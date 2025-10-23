package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    List<User> findByFullNameContainingIgnoreCase(String fullName);

    @Query("SELECT COUNT(u) FROM User u WHERE u.active = true")
    long countTotalUsers();

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'USER' AND u.active = true")
    long countNormalUsers();

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'STAFF' AND u.active = true")
    long countStaffs();

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'ADMIN' AND u.active = true")
    long countAdmins();

    List<User> findByActiveTrue();
}
