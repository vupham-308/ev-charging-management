package com.ev.evchargingsystem.model.response;

import lombok.Data;

@Data
public class UserReportResponse {
    private Double expenseInCurrentMonth;
    private Double topUpInCurrentMonth;
    private Double avgExpensePerSession;
    private int totalSessions;
}
