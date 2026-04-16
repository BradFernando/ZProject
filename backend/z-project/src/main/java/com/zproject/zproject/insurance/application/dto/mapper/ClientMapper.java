package com.zproject.zproject.insurance.application.dto.mapper;

import com.zproject.zproject.insurance.application.dto.request.ClientRequest;
import com.zproject.zproject.insurance.application.dto.response.ClientResponse;
import com.zproject.zproject.insurance.domain.model.Client;

public class ClientMapper {
    
    private ClientMapper() {
        throw new IllegalStateException("Utility class");
    }

    public static Client toModel(ClientRequest request) {
        return Client.builder()
                .identificationNumber(request.getIdentificationNumber())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .build();
    }

    public static ClientResponse toResponse(Client client) {
        return ClientResponse.builder()
                .id(client.getId())
                .identificationNumber(client.getIdentificationNumber())
                .fullName(client.getFullName())
                .email(client.getEmail())
                .phoneNumber(client.getPhoneNumber())
                .address(client.getAddress())
                .active(client.isActive())
                .build();
    }
}
