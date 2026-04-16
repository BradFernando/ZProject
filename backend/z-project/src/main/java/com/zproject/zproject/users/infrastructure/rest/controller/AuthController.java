package com.zproject.zproject.users.infrastructure.rest.controller;

import com.zproject.zproject.users.application.dto.request.LoginRequest;
import com.zproject.zproject.users.application.dto.request.ChangePasswordRequest;
import com.zproject.zproject.users.application.dto.request.ResetPasswordRequest;
import com.zproject.zproject.users.application.dto.response.AuthResponse;
import com.zproject.zproject.users.domain.port.in.IAuthUseCaseIn;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para la autenticación y gestión de usuarios.
 * Proporciona endpoints para el inicio de sesión y gestión de credenciales.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints para login y gestión de credenciales")
public class AuthController {

    private final IAuthUseCaseIn authUseCase;

    /**
     * Endpoint para iniciar sesión y obtener un token JWT.
     */
    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión para obtener un token JWT")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authUseCase.login(request));
    }

    /**
     * Permite a un usuario autenticado cambiar su propia contraseña.
     */
    @PatchMapping("/change-password")
    @Operation(summary = "Cambiar contraseña propia")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        authUseCase.changePassword(authentication.getName(), request);
        return ResponseEntity.ok().build();
    }

    /**
     * Permite a un administrador resetear la contraseña de cualquier usuario directamente.
     */
    @PatchMapping("/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Resetear contraseña de usuario (Solo ADMIN)")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authUseCase.resetPassword(request);
        return ResponseEntity.ok().build();
    }

    /**
     * El administrador resetea la contraseña de un usuario a su propio username.
     */
    @PostMapping("/initiate-reset/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Resetear clave a Username (Solo ADMIN)",
            description = "Establece la contraseña del usuario igual a su nombre de usuario.")
    public ResponseEntity<Void> initiateReset(@PathVariable String username) {
        authUseCase.resetPasswordToUsername(username);
        return ResponseEntity.ok().build();
    }

}
