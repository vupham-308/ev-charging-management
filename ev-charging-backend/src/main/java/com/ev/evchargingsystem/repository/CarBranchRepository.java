package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.CarBranch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarBranchRepository extends JpaRepository<CarBranch, Integer> {
    List<CarBranch> findAllByActive(boolean active);
}
