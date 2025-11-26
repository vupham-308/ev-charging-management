package com.ev.evchargingsystem.repository;


import com.ev.evchargingsystem.entity.ChargerCost;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChargerCostRepository extends JpaRepository<ChargerCost,Integer> {


    ChargerCost findChargerCostByPortType(String portType);

    ChargerCost findChargerCostById(@NotEmpty int chargerCostId);

    boolean existsByPortType(String portType);
}
