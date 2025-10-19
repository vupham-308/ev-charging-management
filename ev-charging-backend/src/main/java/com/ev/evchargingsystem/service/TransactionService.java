package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.ChargingSession;
import com.ev.evchargingsystem.entity.Transaction;
import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.model.response.TransactionResponse;
import com.ev.evchargingsystem.repository.TransactionRepository;
import com.ev.evchargingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepo;

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

    public double getBalance(){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return transactionRepository.getUserBalance(user.getId());
    }

    public List<TransactionResponse> getAllTransactionsForCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<User> userOpt = userRepo.findByEmail(username);

        List<Transaction> transactions = transactionRepository.findByUserId(userOpt.get().getId());
        List<TransactionResponse> responses = new ArrayList<>();

        for (Transaction t : transactions) {
            TransactionResponse dto = new TransactionResponse();
            dto.setId(t.getId());
            dto.setTotalAmount(t.getTotalAmount());
            dto.setPaymentMethod(t.getPaymentMethod());
            dto.setPaymentType(t.getPaymentType());
            dto.setStatus(t.getStatus());
            dto.setDate(t.getDate());
            dto.setChargingSessionId(
                    t.getChargingSession() != null ? t.getChargingSession().getId() : null
            );
            responses.add(dto);
        }

        return responses;
    }
}
