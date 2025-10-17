package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TransactionController {

    @Autowired
    TransactionService transactionService;

    @GetMapping("/balance")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity balance() {
        return ResponseEntity.ok(transactionService.getBalance());
    }
}
