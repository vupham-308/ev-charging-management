package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.ChargerPoint;
import com.ev.evchargingsystem.entity.Station;
import com.ev.evchargingsystem.model.response.StationResponse;
import com.ev.evchargingsystem.repository.ChargerPointRepository;
import com.ev.evchargingsystem.repository.ReviewStationRepository;
import com.ev.evchargingsystem.repository.StationRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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

    public Station addStation(Station station) {
        return stationRepository.save(station);
    }



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
            rp.setName(station.getName());
            rp.setAddress(station.getAddress());
            rp.setPointChargerTotal(getPointChargerTotalByStation(station.getId()));
            rp.setPointChargerAvailable(getPointChargerAvailableByStation(station.getId()));
            rp.setPortType(chargerPointRepository.findPortTypesByStationID(station.getId()));
            stationResponseList.add(rp);
        }
        return stationResponseList;
    }

    //lấy Station đang có theo format theo id
    public StationResponse getStation(int stationId) {
        Station station = stationRepository.findStationsById(stationId);
        StationResponse rp = new StationResponse();
        rp.setName(station.getName());
        rp.setAddress(station.getAddress());
        rp.setPointChargerTotal(getPointChargerTotalByStation(station.getId()));
        rp.setPointChargerAvailable(getPointChargerAvailableByStation(station.getId()));
        rp.setPortType(chargerPointRepository.findPortTypesByStationID(station.getId()));
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

    public List<StationResponse> searchStations(String keyword) {
        List<Station> stations = stationRepository.searchStations(keyword);
        return stations.stream()
                .map(station -> modelMapper.map(station, StationResponse.class))
                .collect(Collectors.toList());
    }

}
