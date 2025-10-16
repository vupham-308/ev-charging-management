package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.ChargingSession;
import com.ev.evchargingsystem.entity.Transaction;
import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class TransactionService {

    @Autowired
    TransactionRepository transactionRepository;
    public Transaction createTransaction(ChargingSession c, double total){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Transaction transaction = transactionRepository.findTransactionByChargingSession(c);
        if(transaction == null) {
            transaction = new Transaction();
        }
        transaction.setDate(new Date(System.currentTimeMillis()));
        transaction.setTotalAmount(total);
        transaction.setPaymentMethod(c.getPaymentMethod());
        transaction.setPaymentType("WITHDRAW");
        if(c.getPaymentMethod().equals("BALANCE")) {
        Double balance = transactionRepository.getUserBalance(user.getId());
        //check xem đủ tiền để trừ không
            if (balance < total) {
                throw new RuntimeException("Tài khoản của bạn không đủ! Vui lòng nạp tiền để tiếp tục sử dụng.");
            }
        }
        transaction.setStatus("COMPLETED");
        transaction.setChargingSession(c);
        transaction.setUser(user);
        return transactionRepository.save(transaction);
    }
}
