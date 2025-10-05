package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.Station;
import com.ev.evchargingsystem.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StationService {

    @Autowired
    private StationRepository stationRepository;

    public Station addStation(Station station) {
        return stationRepository.save(station);
    }
}
