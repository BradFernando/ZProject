package com.zproject.zproject.users.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para el reseteo de contraseña por parte de un administrador.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Solicitud de reseteo de contraseña por administrador")
public class ResetPasswordRequest {
    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Schema(description = "Nombre del usuario al que se le reseteará la contraseña")
    private String username;

    @NotBlank(message = "La nueva contraseña es obligatoria")
    @Schema(description = "Nueva contraseña asignada por el administrador")
    private String newPassword;
}
