package com.ev.evchargingsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChargerPointStatsResponseForAdmin {
    private long totalPoints;     // Tổng số trụ
    private long availablePoints; // Sẵn sàng (AVAILABLE)
    private long occupiedPoints;  // Đang sử dụng (OCCUPIED)
}