package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.entity.Transaction;
import com.ev.evchargingsystem.model.request.TopUpRequest;
import com.ev.evchargingsystem.model.response.TransactionResponse;
import com.ev.evchargingsystem.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/my")
    public ResponseEntity<List<TransactionResponse>> getMyTransactions() {
        List<TransactionResponse> list = transactionService.getAllTransactionsForCurrentUser();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/topup")
    public ResponseEntity topupPayment(@Valid @RequestBody TopUpRequest topUpRequest){
        return ResponseEntity.ok(transactionService.topUp(topUpRequest));

    }

}
