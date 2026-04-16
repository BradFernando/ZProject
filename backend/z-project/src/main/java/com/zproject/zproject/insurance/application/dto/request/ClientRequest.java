package com.zproject.zproject.insurance.application.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ClientRequest {
    @NotBlank(message = "El número de identificación es obligatorio")
    @Pattern(regexp = "^[0-9]{10}$", message = "El número de identificación debe tener 10 dígitos numéricos")
    private String identificationNumber;

    @NotBlank(message = "El nombre completo es obligatorio")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "El nombre no debe contener números ni caracteres especiales")
    private String fullName;

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "El correo electrónico debe ser válido")
    private String email;

    @NotBlank(message = "El teléfono de contacto es obligatorio")
    private String phoneNumber;

    private String address;
}
