package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.Station;
import com.ev.evchargingsystem.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StationService {

    @Autowired
    private StationRepository stationRepository;

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
}
