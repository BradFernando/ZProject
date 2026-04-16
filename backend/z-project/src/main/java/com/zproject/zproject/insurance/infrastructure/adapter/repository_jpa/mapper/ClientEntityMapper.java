package com.zproject.zproject.insurance.infrastructure.adapter.repository_jpa.mapper;

import com.zproject.zproject.insurance.domain.model.Client;
import com.zproject.zproject.insurance.infrastructure.adapter.repository_jpa.entity.ClientEntity;

public class ClientEntityMapper {

    private ClientEntityMapper() {
        throw new IllegalStateException("Utility class");
    }

    public static Client toDomain(ClientEntity entity) {
        if (entity == null) return null;
        return Client.builder()
                .id(entity.getId())
                .identificationNumber(entity.getIdentificationNumber())
                .fullName(entity.getFullName())
                .email(entity.getEmail())
                .phoneNumber(entity.getPhoneNumber())
                .address(entity.getAddress())
                .active(entity.isActive())
                .build();
    }

    public static ClientEntity toEntity(Client domain) {
        if (domain == null) return null;
        return ClientEntity.builder()
                .id(domain.getId())
                .identificationNumber(domain.getIdentificationNumber())
                .fullName(domain.getFullName())
                .email(domain.getEmail())
                .phoneNumber(domain.getPhoneNumber())
                .address(domain.getAddress())
                .active(domain.isActive())
                .build();
    }
}
