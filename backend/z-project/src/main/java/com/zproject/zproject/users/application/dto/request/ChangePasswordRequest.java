package com.zproject.zproject.users.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la solicitud de cambio de contraseña propia.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Solicitud de cambio de contraseña")
public class ChangePasswordRequest {
    @NotBlank(message = "La contraseña actual es obligatoria")
    @Schema(description = "Contraseña actual del usuario")
    private String currentPassword;

    @NotBlank(message = "La nueva contraseña es obligatoria")
    @Schema(description = "Nueva contraseña deseada")
    private String newPassword;
}
