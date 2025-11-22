package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.entity.CarBranch;
import com.ev.evchargingsystem.service.CarBranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/car-branch")
public class CarBranchController {
    @Autowired
    CarBranchService carBranchService;

    @GetMapping("/getAll")
    public List<CarBranch> getAll(){
        return null;
    }

    @PostMapping("/admin/create")
    @PreAuthorize("hasAuthority('ADMIN')")
    public CarBranch create(@RequestBody CarBranch carBranch){
        return null;
    }

    @PutMapping("/admin/edit")
    @PreAuthorize("hasAuthority('ADMIN')")
    public CarBranch update(@RequestBody CarBranch carBranch){
        return null;
    }

    @DeleteMapping("/admin/delete/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public CarBranch delete(@PathVariable("id")int id){
        //chuyển thành inactive
        return null;
    }

}
