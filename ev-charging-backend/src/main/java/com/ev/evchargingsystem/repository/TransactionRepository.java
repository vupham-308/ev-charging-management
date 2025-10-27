package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.ChargingSession;
import com.ev.evchargingsystem.entity.Transaction;
import com.ev.evchargingsystem.entity.User;
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

    @Query("""
                SELECT SUM(
                CASE 
                    WHEN t.paymentType = 'WITHDRAW' THEN t.totalAmount
                    ELSE 0
                END
                )
                FROM Transaction t
                WHERE t.status = 'COMPLETED' AND t.user.id = :userId
                AND FUNCTION('MONTH', t.date) = FUNCTION('MONTH', CURRENT_DATE)
                AND FUNCTION('YEAR', t.date) = FUNCTION('YEAR', CURRENT_DATE)
            
""")
    Double getExpenseInCurrentMonth(@Param("userId") int userId);

    @Query("""
                SELECT SUM(
                CASE 
                    WHEN t.paymentType = 'TOPUP' THEN t.totalAmount
                    ELSE 0
                END
                )
                FROM Transaction t
                WHERE t.status = 'COMPLETED' AND t.user.id = :userId
                AND FUNCTION('MONTH', t.date) = FUNCTION('MONTH', CURRENT_DATE)
                AND FUNCTION('YEAR', t.date) = FUNCTION('YEAR', CURRENT_DATE)
            
""")
    Double getTopUpInCurrentMonth(@Param("userId") int userId);

    @Query("""
    SELECT COALESCE(AVG(t.totalAmount), 0)
    FROM Transaction t
    WHERE t.status = 'COMPLETED' AND t.paymentType='WITHDRAW'
      AND t.user.id = :userId
""")
    Double getAvgExpensePerSession(@Param("userId") int userId);

    @Query("""
    SELECT SUM(CASE 
                WHEN t.paymentType = 'WITHDRAW' THEN 1
                ELSE 0
            END)
    FROM Transaction t
    WHERE t.status = 'COMPLETED'
      AND t.user.id = :userId
""")
    int getTotalSession(@Param("userId") int userId);

    Transaction findTransactionByChargingSessionId(int chargingSessionId);

    List<Transaction> findByUserId(int userId);

    void deleteByUser(User user);

    List<Transaction> findTransactionByStatus(String status);

    Transaction findTransactionById(int id);


}

