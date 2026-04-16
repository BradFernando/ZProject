package com.zproject.zproject.insurance.infrastructure.adapter.repository_jpa.mapper;

import com.zproject.zproject.insurance.domain.model.Policy;
import com.zproject.zproject.insurance.infrastructure.adapter.repository_jpa.entity.PolicyEntity;

public class PolicyEntityMapper {

    private PolicyEntityMapper() {
        throw new IllegalStateException("Utility class");
    }

    public static Policy toDomain(PolicyEntity entity) {
        if (entity == null) return null;
        return Policy.builder()
                .id(entity.getId())
                .clientId(entity.getClientId())
                .type(entity.getType())
                .startDate(entity.getStartDate())
                .expirationDate(entity.getExpirationDate())
                .insuredAmount(entity.getInsuredAmount())
                .status(entity.getStatus())
                .build();
    }

    public static PolicyEntity toEntity(Policy domain) {
        if (domain == null) return null;
        return PolicyEntity.builder()
                .id(domain.getId())
                .clientId(domain.getClientId())
                .type(domain.getType())
                .startDate(domain.getStartDate())
                .expirationDate(domain.getExpirationDate())
                .insuredAmount(domain.getInsuredAmount())
                .status(domain.getStatus())
                .build();
    }
}
