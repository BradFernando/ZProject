package com.zproject.zproject.insurance.application.dto.request;

import com.zproject.zproject.insurance.domain.model.Policy;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PolicyRequest {
    @NotNull(message = "El ID del cliente es obligatorio")
    private Long clientId;

    @NotNull(message = "El tipo de póliza es obligatorio")
    private Policy.PolicyType type;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDate startDate;

    @NotNull(message = "La fecha de expiración es obligatoria")
    @Future(message = "La fecha de expiración debe ser en el futuro")
    private LocalDate expirationDate;

    @NotNull(message = "El monto asegurado es obligatorio")
    @Positive(message = "El monto asegurado debe ser un valor numérico positivo")
    private BigDecimal insuredAmount;
}
