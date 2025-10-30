package com.ev.evchargingsystem.model.request;

import com.ev.evchargingsystem.entity.User;
import lombok.Data;
import org.hibernate.annotations.Check;

@Check(constraints = "status IN ('PENDING', 'IN_PROGRESS', 'SOLVED')")
@Data
public class ProblemResponseRequest {
    private String response;
    private String status;
}
