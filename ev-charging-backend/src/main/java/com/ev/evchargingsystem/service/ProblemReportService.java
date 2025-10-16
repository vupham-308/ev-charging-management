package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.ProblemReport;
import com.ev.evchargingsystem.entity.Staff;
import com.ev.evchargingsystem.entity.Station;
import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.model.request.ProblemRequest;
import com.ev.evchargingsystem.model.request.ProblemResponseRequest;
import com.ev.evchargingsystem.model.response.ProblemReportResponse;
import com.ev.evchargingsystem.repository.*;
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
    @Autowired
    UserRepository userRepository;

    //người dùng tạo 1 problem
    public ProblemReport create(ProblemRequest rq, int stationID) {
        User user= (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Station s = stationRepository.findStationsById(stationID);
        ProblemReport problemReport = new ProblemReport();
        problemReport.setTitle(rq.getTitle());
        problemReport.setDescription(rq.getDescription());
        problemReport.setCreatedAt(new Date(System.currentTimeMillis()));
        problemReport.setStation(s);
        problemReport.setUser(user);
        problemReport.setStatus("PENDING");
        return problemReportRepository.save(problemReport);
    }

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
            throw new RuntimeException("Lỗi trong quá trình lấy thông tin!");
        }
    }

    public ProblemReportResponse response(ProblemResponseRequest r, int id) {
        ProblemReport p = problemReportRepository.findById(id);
        User current = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //check, nếu là staff của station đó thì mới response được
        List<Staff> staffs = staffRepository.findStaffsByStationId(p.getStation().getId());
        boolean isAssigned = false;
        for (Staff s : staffs) {
            if(s.getUser().getId() == current.getId()){
                isAssigned=true;
                break;
            }
        }
        //admin có thể response tất cả
        if(current.getRole().equals("ADMIN")) {isAssigned = true;}
        if ((!isAssigned)||p==null) {
            throw new RuntimeException("Bạn không có quyền để truy cập nội dung này!");
        }
        else {
            String user = current.getFullName();
            String reponse = r.getResponse() + System.lineSeparator() + "Đã được trả lời bởi " + user;
            p.setResponse(reponse);
            p.setStatus(r.getStatus());
            if(r.getStatus().equals("SOLVED")) {
                p.setSolvedAt(new Date(System.currentTimeMillis()));
            }
            problemReportRepository.save(p);
            return modelMapper.map(p, ProblemReportResponse.class);
        }
    }

    public List<ProblemReport> getAllForAdmin() {
        return problemReportRepository.findAll();
    }

    public List<ProblemReport> getAll(String status) {
        if (status.equals("IN_PROGRESS")) {
            return problemReportRepository.findAllByStatus("IN_PROGRESS");
        } else if (status.equals("SOLVED")) {
            return problemReportRepository.findAllByStatus("SOLVED");
        } else if (status.equals("PENDING")) {
            return problemReportRepository.findAllByStatus("PENDING");
        } else
            return problemReportRepository.findAll();
    }

    public List<ProblemReport> getAllByStaff() {
        User current = (User)  SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(!current.getRole().equals("STAFF")) {
            throw new RuntimeException("Trang này chỉ dành cho nhân viên trạm sạc!");
        }
        Station s = current.getStaff().getStation();
        return problemReportRepository.findAllByStation(s);
    }

    public ProblemReport setStatus(int id, String status) {
        ProblemReport p = problemReportRepository.findById(id);
        p.setStatus(status);
        return problemReportRepository.save(p);
    }
}
