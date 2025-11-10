package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.ChargerPoint;
import com.ev.evchargingsystem.entity.Station;
import com.ev.evchargingsystem.model.response.*;
import com.ev.evchargingsystem.repository.*;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StationService {

    @Autowired
    private StationRepository stationRepository;
    @Autowired
    private ChargerPointRepository chargerPointRepository;
    @Autowired
    private ReviewStationRepository reviewStationRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private ChargingSessionRepository chargingSessionRepository;


    public Station addStation(Station station) {
        return stationRepository.save(station);
    }
    @Value("${geoapify.api.key}")
    private String apiKey;

    public Station updateStation(Integer id, Station stationDetails) {
        // 1. Tìm Station trong DB, kết quả trả về là một Optional
        Optional<Station> optionalStation = stationRepository.findById(id);

        // 2. Kiểm tra
        if (optionalStation.isPresent()) {
            // 3. Nếu có, lấy Station ra để cập nhật
            Station existingStation = optionalStation.get();

            existingStation.setName(stationDetails.getName());
            existingStation.setAddress(stationDetails.getAddress());
            existingStation.setPhone(stationDetails.getPhone());
            existingStation.setEmail(stationDetails.getEmail());
            existingStation.setStatus(stationDetails.getStatus());
            existingStation.setLatitude(stationDetails.getLatitude());
            existingStation.setLongitude(stationDetails.getLongitude());

            // 4. Lưu lại và trả về Station đã cập nhật
            return stationRepository.save(existingStation);
        } else {
            // 5. Nếu không tìm thấy, trả về null để Controller xử lý
            return null;
        }
    }

    public boolean deleteStation(Integer id) {
        // Kiểm tra xem station có tồn tại với id này không
        if (stationRepository.existsById(id)) {
            stationRepository.deleteById(id);
            return true;
        }
        return false;
    }

    //lấy danh sách Station đang có theo format
    public List<StationResponse> getAllStations() {
        List<StationResponse> stationResponseList = new ArrayList<>();
        List<Station> stations = stationRepository.findAll();
        for(Station station : stations) {
            StationResponse rp = new StationResponse();
            rp.setId(station.getId());
            rp.setName(station.getName());
            rp.setAddress(station.getAddress());
            rp.setPointChargerTotal(getPointChargerTotalByStation(station.getId()));
            rp.setPointChargerAvailable(getPointChargerAvailableByStation(station.getId()));
            rp.setPointChargerOutOfService(getPointChargerOutOfServiceByStation(station.getId()));
            rp.setPortType(chargerPointRepository.findPortTypesByStationID(station.getId()));
            rp.setLatitude(station.getLatitude());
            rp.setLongitude(station.getLongitude());
            rp.setPhone(station.getPhone());
            rp.setEmail(station.getEmail());
            rp.setStatus(station.getStatus());

            stationResponseList.add(rp);
        }
        return stationResponseList;
    }

    //lấy Station đang có theo format theo id
    public StationResponse getStation(int stationId) {
        Station station = stationRepository.findStationsById(stationId);
        StationResponse rp = new StationResponse();
        rp.setId(station.getId());
        rp.setName(station.getName());
        rp.setAddress(station.getAddress());
        rp.setPointChargerTotal(getPointChargerTotalByStation(station.getId()));
        rp.setPointChargerAvailable(getPointChargerAvailableByStation(station.getId()));
        rp.setPointChargerOutOfService(getPointChargerOutOfServiceByStation(station.getId()));
        rp.setPortType(chargerPointRepository.findPortTypesByStationID(station.getId()));
        rp.setLatitude(station.getLatitude());
        rp.setLongitude(station.getLongitude());
        rp.setPhone(station.getPhone());
        rp.setEmail(station.getEmail());
        rp.setStatus(station.getStatus());
        return rp;
    }

    public int getPointChargerTotalByStation(int stationID){
        return chargerPointRepository.findChargerPointsByStationId(stationID).size();
    }

    public int getPointChargerAvailableByStation(int stationID){
        int count=0;
        List<ChargerPoint> list = chargerPointRepository.findChargerPointsByStationId(stationID);
        for(ChargerPoint x: list){
            if(x.getStatus().equals("AVAILABLE")){
                count++;
            }
        }
        return count;
    }

    public int getPointChargerOutOfServiceByStation(int stationID){
        int count=0;
        List<ChargerPoint> list = chargerPointRepository.findChargerPointsByStationId(stationID);
        for(ChargerPoint x: list){
            if(x.getStatus().equals("OUT_OF_SERVICE")){
                count++;
            }
        }
        return count;
    }

    public List<StationResponse> searchStations(String keyword) {
        List<StationResponse> stationResponseList = new ArrayList<>();
        List<Station> stations = stationRepository.searchStations(keyword);
        for(Station station : stations) {
            StationResponse rp = new StationResponse();
            rp.setName(station.getName());
            rp.setAddress(station.getAddress());
            rp.setPointChargerTotal(getPointChargerTotalByStation(station.getId()));
            rp.setPointChargerAvailable(getPointChargerAvailableByStation(station.getId()));
            rp.setPointChargerOutOfService(getPointChargerOutOfServiceByStation(station.getId()));
            rp.setPortType(chargerPointRepository.findPortTypesByStationID(station.getId()));
            rp.setLatitude(station.getLatitude());
            rp.setLongitude(station.getLongitude());
            stationResponseList.add(rp);
        }
        return stationResponseList;
    }

    public StationStatsResponseForAdmin getStationStats() {
        long total = stationRepository.countTotalStations();
        long active = stationRepository.countActiveStations();
        long inactive = stationRepository.countInactiveStations();
        return new StationStatsResponseForAdmin(total, active, inactive);
    }

    public Station getStationById(int id) {
        return stationRepository.findById(id).orElse(null);
    }

    public ResponseEntity<?> getStationChargerStatus(int stationId) {
        List<ChargerPoint> chargerPoints = chargerPointRepository.findByStationId(stationId);

        if (chargerPoints.isEmpty()) {
            return ResponseEntity.badRequest().body("Trạm này chưa có trụ sạc nào");
        }

        // Đếm số lượng theo trạng thái
        long available = chargerPoints.stream()
                .filter(cp -> "AVAILABLE".equalsIgnoreCase(cp.getStatus()))
                .count();
        long occupied = chargerPoints.stream()
                .filter(cp -> "OCCUPIED".equalsIgnoreCase(cp.getStatus()))
                .count();
        long reserved = chargerPoints.stream()
                .filter(cp -> "RESERVED".equalsIgnoreCase(cp.getStatus()))
                .count();
        long outOfService = chargerPoints.stream()
                .filter(cp -> "OUT_OF_SERVICE".equalsIgnoreCase(cp.getStatus()))
                .count();

        CPointStatusResponseForStaff response = new CPointStatusResponseForStaff(
                available, occupied, reserved, outOfService
        );

        return ResponseEntity.ok(response);
    }

    public double getTotalRevenueForAllStationsThisMonth() {
        return transactionRepository.getTotalRevenueForAllStationsThisMonth();
    }

    public StationDetailResponse getStationDetailForAdmin(int stationId) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trạm có ID: " + stationId));

        int total = chargerPointRepository.countTotalByStationId(stationId);
        int available = chargerPointRepository.countAvailableByStationId(stationId);
        int occupied = chargerPointRepository.countOccupiedByStationId(stationId);
        int reserved = chargerPointRepository.countReservedByStationId(stationId);
        int outOfService = chargerPointRepository.countOutOfServiceByStationId(stationId);

        return new StationDetailResponse(
                station.getId(),
                station.getName(),
                station.getAddress(),
                station.getPhone(),
                station.getEmail(),
                station.getStatus(),
                total,
                available,
                occupied,
                reserved,
                outOfService
        );
    }

    public StaffDashboardResponse getThisWeekStatsByStationId(int stationId) {
        // Lấy trạm theo id
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trạm với ID: " + stationId));

        // Lấy khoảng thời gian đầu và cuối tuần hiện tại
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(DayOfWeek.SUNDAY).plusDays(1);

        Date start = Date.from(startOfWeek.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date end = Date.from(endOfWeek.atStartOfDay(ZoneId.systemDefault()).toInstant());

        double revenue = transactionRepository.sumByStationAndDateRange(stationId, start, end);
        long customers = chargingSessionRepository.countDistinctUserByStationAndDate(stationId, start, end);
        long sessions = chargingSessionRepository.countByStationAndDate(stationId, start, end);
        Double avgTime = chargingSessionRepository.findAverageChargingTimeByStationAndDate(stationId, start, end);
        String mostUsed = chargingSessionRepository.findMostUsedChargerPointByStationAndDate(stationId, start, end);

        return new StaffDashboardResponse(
                station.getId(),
                station.getName(),
                revenue,
                customers,
                sessions,
                avgTime != null ? avgTime : 0,
                mostUsed != null ? mostUsed : "Không có dữ liệu"
        );
    }

    public List<Top5StationRevenue> getTop5StationsByRevenue() {
        List<Object[]> rows = transactionRepository.findTop5StationsByRevenue();
        List<Top5StationRevenue> responses = new ArrayList<>();

        for (Object[] row : rows) {
            Top5StationRevenue dto = new Top5StationRevenue();
            dto.setStationId(((Number) row[0]).intValue());
            dto.setStationName((String) row[1]);
            dto.setAddress((String) row[2]);
            dto.setTotalRevenue(((Number) row[3]).doubleValue());
            responses.add(dto);
        }

        return responses;
    }

    public List<StationResponse> getNearestStations(double latitute, double longitude) throws IOException {
        List<Station> stations = stationRepository.findAll();
        List<StationResponse> rs = new ArrayList<>();
        System.out.println(apiKey);

        for(Station s: stations){
            String url = String.format(
                    "https://api.geoapify.com/v1/routing?waypoints=%f,%f|%f,%f&mode=drive&apiKey=%s",
                    latitute, longitude, s.getLatitude(), s.getLongitude(), apiKey
            );
            System.out.println(url);

            OkHttpClient client = new OkHttpClient();
            Request request = new Request.Builder()
                    .url(url)
                    .get()
                    .build();
            Response response = client.newCall(request).execute();
            JsonObject props = JsonParser.parseString(response.body().string())
                    .getAsJsonObject()
                    .getAsJsonArray("features")
                    .get(0).getAsJsonObject()
                    .getAsJsonObject("properties");

            double distance = props.get("distance").getAsDouble() / 1000.0;

            rs.add(new StationResponse(s.getId(), s.getName(), s.getAddress(),
                    getPointChargerAvailableByStation(s.getId()),
                    getPointChargerOutOfServiceByStation(s.getId()),
                    getPointChargerTotalByStation(s.getId()),
                    chargerPointRepository.findPortTypesByStationID(s.getId()),
                    s.getPhone(),
                    s.getEmail(),
                    s.getStatus(),
                    s.getLatitude(),
                    s.getLongitude(),
                    distance));
        }
        return rs;
    }
}
