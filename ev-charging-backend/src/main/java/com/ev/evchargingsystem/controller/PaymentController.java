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
    public void paymentCallback(@PathVariable("id") int id,
        @RequestParam Map<String, String> params, HttpServletResponse response) throws NoSuchAlgorithmException, InvalidKeyException, IOException {
        Transaction t = paymentService.paymentCallback(id, params);
        String url="http://localhost:5173/payment-return?vnp_Amount=0&vnp_ResponseCode=1";
        try {
            if(t!=null&&t.getStatus().equals("COMPLETED")){
                url = "http://localhost:5173/payment-return?vnp_Amount=" + t.getTotalAmount() + "&vnp_ResponseCode=00";}
            response.sendRedirect(url);
        }catch (Exception e){
            response.sendRedirect(url);
        }
    }

}
