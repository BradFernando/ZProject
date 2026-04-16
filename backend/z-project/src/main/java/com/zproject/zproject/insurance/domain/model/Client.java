package com.zproject.zproject.insurance.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Modelo de dominio que representa a un Cliente en el sistema de seguros.
 * Contiene la información personal y de contacto del cliente.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    /** Identificador único en la base de datos. */
    private Long id;
    
    /** Número de identificación único de 10 dígitos. */
    private String identificationNumber;
    
    /** Nombre completo del cliente. */
    private String fullName;
    
    /** Correo electrónico de contacto. */
    private String email;
    
    /** Número de teléfono de contacto. */
    private String phoneNumber;
    
    /** Dirección domiciliaria del cliente. */
    private String address;

    /** Indica si el cliente está activo en el sistema. */
    @Builder.Default
    private boolean active = true;
}
