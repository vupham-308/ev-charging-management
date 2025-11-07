package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.*;
import com.ev.evchargingsystem.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Component
public class DataExportScheduler {

    @Autowired private CarRepository carRepo;
    @Autowired private ChargerCostRepository chargerCostRepo;
    @Autowired private ChargerPointRepository chargerPointRepo;
    @Autowired private ChargingSessionRepository chargingSessionRepo;
    @Autowired private ProblemReportRepository problemReportRepo;
    @Autowired private ReservationRepository reservationRepo;
    @Autowired private ReviewStationRepository reviewStationRepo;
    @Autowired private StaffRepository staffRepo;
    @Autowired private StationRepository stationRepo;
    @Autowired private TransactionRepository transactionRepo;

    private final ObjectMapper mapper = new ObjectMapper();

    public void exportPublicData(){
        System.out.println("Đang export dữ liệu hệ thống... " + new Date());

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("timestamp", new Date());
        data.put("chargerCosts", chargerCostRepo.findAll());
        data.put("chargerPoints", chargerPointRepo.findAll());
        data.put("reviewStations", reviewStationRepo.findAll());
        data.put("stations", stationRepo.findAll());

        // 📁 Đường dẫn lưu file
        File dir = new File("data");
        if (!dir.exists()) dir.mkdirs();

        // 🔁 Ghi đè vào cùng 1 file
        File outputFile = new File(dir, "database-export.json");

        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(outputFile, data);
            System.out.println("Đã export dữ liệu vào: " + outputFile.getAbsolutePath());
        } catch (IOException e) {
            System.err.println("Lỗi ghi file export: " + e.getMessage());
        }
    }

    public void exportDatabaseSnapshot(User user) {
        System.out.println("Đang export dữ liệu hệ thống... " + new Date());
        System.out.println("User" + user.toString());

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("timestamp", new Date());
        data.put("cars", carRepo.findAllByUser(user));
        data.put("chargerCosts", chargerCostRepo.findAll());
        data.put("chargerPoints", chargerPointRepo.findAll());
        data.put("chargingSessions", chargingSessionRepo.findChargingSessionByUser(user));
        data.put("problemReports", problemReportRepo.findAllByUserId(user.getId()));
        data.put("reservations", reservationRepo.findByUserId(user.getId()));
        data.put("reviewStations", reviewStationRepo.findAll());
        data.put("stations", stationRepo.findAll());
        data.put("transactions", transactionRepo.findByUserId(user.getId()));

        // 📁 Đường dẫn lưu file
        File dir = new File("data");
        if (!dir.exists()) dir.mkdirs();

        // 🔁 Ghi đè vào cùng 1 file
        File outputFile = new File(dir, "database-export.json");

        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(outputFile, data);
            System.out.println("Đã export dữ liệu vào: " + outputFile.getAbsolutePath());
        } catch (IOException e) {
            System.err.println("Lỗi ghi file export: " + e.getMessage());
        }
    }
}

