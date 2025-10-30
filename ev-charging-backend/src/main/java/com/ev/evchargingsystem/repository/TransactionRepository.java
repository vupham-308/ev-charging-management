package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.ChargingSession;
import com.ev.evchargingsystem.entity.Transaction;
import com.ev.evchargingsystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
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

    //tổng tiền giao dịch của trạm trong khoảng thời gian
    @Query("""
       SELECT COALESCE(SUM(t.totalAmount), 0)
       FROM Transaction t
       WHERE t.date BETWEEN :start AND :end
         AND t.status = 'COMPLETED'
         AND t.chargingSession.chargerPoint.station.id = :stationId
       """)
    double sumByStationAndDateRange(@Param("stationId") int stationId,
                                    @Param("start") Date start,
                                    @Param("end") Date end);

    //Admin xem doanh thu tất cả trạm trong tháng hiện tại
    @Query("""
       SELECT COALESCE(SUM(t.totalAmount), 0)
       FROM Transaction t
       JOIN t.chargingSession cs
       JOIN cs.chargerPoint cp
       JOIN cp.station s
       WHERE t.status = 'COMPLETED'
         AND MONTH(t.date) = MONTH(CURRENT_DATE)
         AND YEAR(t.date) = YEAR(CURRENT_DATE)
       """)
    double getTotalRevenueForAllStationsThisMonth();

    //top 5 doanh thu
    @Query(value = """
    SELECT TOP 5 
        s.id AS stationId,
        s.name AS stationName,
        s.address,
        COALESCE(SUM(t.total_amount), 0) AS totalRevenue
    FROM transactions t
    JOIN charging_sessions cs ON t.charging_session_id = cs.id
    JOIN charger_points cp ON cs.charger_point_id = cp.id
    JOIN stations s ON cp.station_id = s.id
    WHERE t.status = 'COMPLETED'
    GROUP BY s.id, s.name, s.address
    ORDER BY totalRevenue DESC
    """, nativeQuery = true)
    List<Object[]> findTop5StationsByRevenue();

}

