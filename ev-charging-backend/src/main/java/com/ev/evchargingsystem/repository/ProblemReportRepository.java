package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.ProblemReport;
import com.ev.evchargingsystem.entity.Station;
import com.ev.evchargingsystem.model.response.ProblemReportResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProblemReportRepository extends JpaRepository<ProblemReport,Integer> {
    List<ProblemReport> findAllByUserId(int userId);
    ProblemReport findById(int id);
    List<ProblemReport> findAllByStatus(String status);

    List<ProblemReport> findAllByStation(Station station);
}
