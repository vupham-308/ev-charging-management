package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.entity.Transaction;
import com.ev.evchargingsystem.model.request.TopUpRequest;
import com.ev.evchargingsystem.service.PaymentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    PaymentService paymentService;
    //tạo link thanh toán
    @GetMapping("/{id}")
    public ResponseEntity createPayment(@PathVariable("id") int transactionId){
        String url = paymentService.createPayment(transactionId);
        return ResponseEntity.ok(url);
    }

    @GetMapping("/success/{id}")
    public ResponseEntity paymentCallback(@PathVariable("id") int id,
        @RequestParam Map<String, String> params, HttpServletResponse response) throws NoSuchAlgorithmException, InvalidKeyException {
        try {
            Transaction t = paymentService.paymentCallback(id, params);
            String url = "http://222.255.214.35:8080/api/payment/"+t.getId();
            if(t!=null){
                response.sendRedirect(url);
            }
            return ResponseEntity.ok(t);
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
