package com.zproject.zproject.insurance.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Modelo de dominio que representa una Póliza de seguro asociada a un cliente.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Policy {
    /** Identificador único de la póliza. */
    private Long id;
    
    /** Identificador del cliente asociado a la póliza. */
    private Long clientId;
    
    /** Categoría de la póliza (Vida, Automóvil, etc.). */
    private PolicyType type;
    
    /** Fecha en la que entra en vigencia la póliza. */
    private LocalDate startDate;
    
    /** Fecha de vencimiento de la póliza. */
    private LocalDate expirationDate;
    
    /** Capital total asegurado. */
    private BigDecimal insuredAmount;
    
    /** Estado operativo actual de la póliza. */
    private PolicyStatus status;

    /**
     * Tipos permitidos de pólizas.
     */
    public enum PolicyType {
        VIDA, AUTOMOVIL, SALUD, HOGAR
    }

    /**
     * Estados posibles de una póliza.
     */
    public enum PolicyStatus {
        ACTIVA, CANCELADA
    }
}
