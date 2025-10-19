package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.ChargingSession;
import com.ev.evchargingsystem.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @Query("""
                SELECT COALESCE(SUM(
                    CASE 
                        WHEN t.paymentMethod <> 'CASH' AND t.paymentType = 'TOPUP' THEN t.totalAmount
                        WHEN t.paymentMethod <> 'CASH' AND t.paymentType = 'WITHDRAW' THEN -t.totalAmount
                        ELSE 0
                    END
                ), 0)
                FROM Transaction t
                WHERE t.status = 'COMPLETED' AND t.user.id = :userId
            """)
    Double getUserBalance(@Param("userId") int userId);

    Transaction findTransactionByChargingSession(ChargingSession chargingSession);

    List<Transaction> findByUserId(int userId);
}

