package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.ProblemReport;
import com.ev.evchargingsystem.entity.Staff;
import com.ev.evchargingsystem.entity.Station;
import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.model.request.ProblemRequest;
import com.ev.evchargingsystem.model.response.ProblemReportResponse;
import com.ev.evchargingsystem.repository.AuthenticationRepository;
import com.ev.evchargingsystem.repository.ProblemReportRepository;
import com.ev.evchargingsystem.repository.StaffRepository;
import com.ev.evchargingsystem.repository.StationRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.ServiceConfigurationError;

@Service
public class ProblemReportService {
    @Autowired
    ProblemReportRepository problemReportRepository;
    @Autowired
    StationRepository stationRepository;
    @Autowired
    StaffRepository staffRepository;
    @Autowired
    AuthenticationRepository authenticationRepository;
    @Autowired
    ModelMapper modelMapper;

    //người dùng tạo 1 problem
    public ProblemReport create(ProblemRequest rq, int stationID) {
        User user= (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        User u = authenticationRepository.findUserByEmail(user.getUsername());
        Station s = stationRepository.findStationsById(stationID);
        List<Staff> staffs = staffRepository.findStaffsByStationId(stationID);
        ProblemReport problemReport = new ProblemReport();
        problemReport.setTitle(rq.getTitle());
        problemReport.setDescription(rq.getDescription());
        problemReport.setCreatedAt(new Date(System.currentTimeMillis()));
        problemReport.setStation(s);
        problemReport.setAssignedStaff(staffs);
        problemReport.setUser(user);
        problemReport.setStatus("PENDING");
        return problemReportRepository.save(problemReport);
    }

//    public List<ProblemReport> getAllByDriver(int userId){
//        List<ProblemReport> list =  problemReportRepository.findAll();
//       return list;
//    }
    public List<ProblemReportResponse> getAllByDriver(){
        try {
            User u = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            List<ProblemReport> list = problemReportRepository.findAllByUserId(u.getId());
            List<ProblemReportResponse> result = new ArrayList<>();
            for (ProblemReport p : list) {
                ProblemReportResponse r = new ProblemReportResponse();
                modelMapper.map(p, r);
                result.add(r);
            }
            return result;
        }catch (Exception e){
            throw new RuntimeException("Lỗi rồi");
        }
    }
}
