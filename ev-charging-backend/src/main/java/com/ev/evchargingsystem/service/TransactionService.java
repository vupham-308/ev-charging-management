package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.ChargingSession;
import com.ev.evchargingsystem.entity.Transaction;
import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.model.request.TopUpRequest;
import com.ev.evchargingsystem.model.response.TransactionResponse;
import com.ev.evchargingsystem.model.response.UserReportResponse;
import com.ev.evchargingsystem.repository.TransactionRepository;
import com.ev.evchargingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
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

    @Autowired
    PaymentService paymentService;

    public Transaction createTransaction(ChargingSession c, double total){
        User user = c.getCar().getUser();
        Transaction transaction = transactionRepository.findTransactionByChargingSessionId(c.getId());
        if(transaction == null) {
            transaction = new Transaction();
        }
        transaction.setDate(new Date(System.currentTimeMillis()));
        transaction.setTotalAmount(total);
        transaction.setPaymentMethod(c.getPaymentMethod());
        transaction.setPaymentType("WITHDRAW");
        transaction.setStatus("PENDING");
        transaction.setChargingSession(c);
        transaction.setUser(user);
        if(c.getPaymentMethod().equals("BALANCE")) {
        Double balance = transactionRepository.getUserBalance(user.getId());
        //check xem đủ tiền để trừ không
            if (balance < total) {
                transaction.setStatus("FAILED");
                transactionRepository.save(transaction);
                throw new RuntimeException("Tài khoản của bạn không đủ! Vui lòng nạp tiền để tiếp tục sử dụng.");
            }
        }
        return transactionRepository.save(transaction);
    }

    public Transaction setComplete(Transaction transaction){
        transaction.setStatus("COMPLETED");
        return transactionRepository.save(transaction);
    }

    @Scheduled(cron="0 0 0 * * *")//reload mỗi ngày
    public void updateCashStatus(){
        //nếu kh chọn cash, cần liên hệ nhân viên thanh toán
        //nếu không cứ 0h transaction sẽ trở thành fail
        List<Transaction> list = transactionRepository.findTransactionByStatus("PENDING");
        for(Transaction t : list){
            t.setStatus("FAILED");
            transactionRepository.save(t);
        }
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
            if(t.getChargingSession()!=null) {
                dto.setChargingSessionId(t.getChargingSession().getId());
                dto.setStationName(t.getChargingSession().getChargerPoint().getStation().getName());
            }
            responses.add(dto);
        }

        return responses;
    }

    public String topUp(TopUpRequest topUpRequest){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Transaction t = new Transaction(new Date(System.currentTimeMillis()),
                topUpRequest.getTotalAmount(),topUpRequest.getPaymentMethod(),
                "TOPUP","PENDING",user);
        transactionRepository.save(t);
        //Trả về URL thanh toán VNPAY
        return paymentService.createPayment(t.getId());
    }

    public UserReportResponse getUserReport() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Double avgExpense = transactionRepository.getAvgExpensePerSession(user.getId());
        int totalSessions = transactionRepository.getTotalSession(user.getId());
        Double expenseCurrentMonth = transactionRepository.getExpenseInCurrentMonth(user.getId());
        Double topUpCurrentMonth = transactionRepository.getTopUpInCurrentMonth(user.getId());

        UserReportResponse report = new UserReportResponse();
        report.setAvgExpensePerSession(avgExpense);
        report.setTotalSessions(totalSessions);
        report.setExpenseInCurrentMonth(expenseCurrentMonth);
        report.setTopUpInCurrentMonth(topUpCurrentMonth);

        return report;
    }

    public Double getAvgExpensePerSession() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return transactionRepository.getAvgExpensePerSession(user.getId());
    }

    public int getTotalSessions() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return transactionRepository.getTotalSession(user.getId());
    }

    public Double getExpenseInCurrentMonth() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return transactionRepository.getExpenseInCurrentMonth(user.getId());

    }

    public Double getTopUpInCurrentMonth() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return transactionRepository.getTopUpInCurrentMonth(user.getId());
    }

    public Transaction getTransactionById(int id){
        return transactionRepository.findTransactionById(id);
    }
}
