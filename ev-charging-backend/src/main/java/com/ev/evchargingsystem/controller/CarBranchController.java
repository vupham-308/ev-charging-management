package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.entity.CarBranch;
import com.ev.evchargingsystem.service.CarBranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/car-branch")
public class CarBranchController {
    @Autowired
    CarBranchService carBranchService;

    @GetMapping("/getAll")
    public ResponseEntity<List<CarBranch>> getAll(){
        return ResponseEntity.ok(carBranchService.getAllCarBranches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarBranch> getById(@PathVariable("id") int id){
        return ResponseEntity.ok(carBranchService.getCarBranchById(id));
    }

    @PostMapping("/admin/create")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<CarBranch> create(@RequestBody CarBranch carBranch){
        return ResponseEntity.ok(carBranchService.addNewCarBranch(carBranch));
    }

    @PutMapping("/admin/edit/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<CarBranch> update(@PathVariable("id") int id, @RequestBody CarBranch carBranch){
        return ResponseEntity.ok(carBranchService.updateCarBranch(id, carBranch));
    }

    @DeleteMapping("/admin/delete/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable("id")int id){
        //chuyển thành inactive
        carBranchService.deleteCarBranch(id);
        return ResponseEntity.ok().build();
    }

}
