package com.zproject.zproject.insurance.application.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClientResponse {
    private Long id;
    private String identificationNumber;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
    private boolean active;
}
