package com.zproject.zproject.insurance.application.dto.mapper;

import com.zproject.zproject.insurance.application.dto.request.PolicyRequest;
import com.zproject.zproject.insurance.application.dto.response.PolicyResponse;
import com.zproject.zproject.insurance.domain.model.Policy;

public class PolicyMapper {

    private PolicyMapper() {
        throw new IllegalStateException("Utility class");
    }

    public static Policy toModel(PolicyRequest request) {
        return Policy.builder()
                .clientId(request.getClientId())
                .type(request.getType())
                .startDate(request.getStartDate())
                .expirationDate(request.getExpirationDate())
                .insuredAmount(request.getInsuredAmount())
                .build();
    }

    public static PolicyResponse toResponse(Policy policy) {
        return PolicyResponse.builder()
                .id(policy.getId())
                .clientId(policy.getClientId())
                .type(policy.getType())
                .startDate(policy.getStartDate())
                .expirationDate(policy.getExpirationDate())
                .insuredAmount(policy.getInsuredAmount())
                .status(policy.getStatus())
                .build();
    }
}
