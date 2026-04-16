package com.zproject.zproject.insurance.application.dto.response;

import com.zproject.zproject.insurance.domain.model.Policy;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class PolicyResponse {
    private Long id;
    private Long clientId;
    private Policy.PolicyType type;
    private LocalDate startDate;
    private LocalDate expirationDate;
    private BigDecimal insuredAmount;
    private Policy.PolicyStatus status;
}
