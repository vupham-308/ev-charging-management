package com.ev.evchargingsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserStatsResponseForAdmin {
    private long totalUsers;
    private long drivers;
    private long staffs;
    private long admins;
}