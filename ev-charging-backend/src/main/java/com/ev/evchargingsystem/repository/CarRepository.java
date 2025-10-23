package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.Car;
import com.ev.evchargingsystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, Integer> {
    List<Car> findByUserId(int userId);
    Optional<Car> findByIdAndUserId(int id, int userId);
    List<Car> findByUser(User user);
    void deleteByUser(User user);
    List<Car> findByUserAndActiveTrue(User user);
}