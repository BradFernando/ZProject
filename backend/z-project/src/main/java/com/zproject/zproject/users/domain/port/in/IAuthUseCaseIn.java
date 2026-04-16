package com.zproject.zproject.users.domain.port.in;

import com.zproject.zproject.users.application.dto.request.LoginRequest;
import com.zproject.zproject.users.application.dto.request.ChangePasswordRequest;
import com.zproject.zproject.users.application.dto.request.ResetPasswordRequest;
import com.zproject.zproject.users.application.dto.response.AuthResponse;

/**
 * Puerto de entrada para el caso de uso de autenticación y gestión de usuarios.
 */
public interface IAuthUseCaseIn {
    /**
     * Procesa la solicitud de inicio de sesión y devuelve la respuesta de autenticación.
     * @param request Datos de inicio de sesión.
     * @return Respuesta con el token generado.
     */
    AuthResponse login(LoginRequest request);

    /**
     * Permite a un usuario cambiar su propia contraseña.
     * @param username Nombre del usuario.
     * @param request DTO con la contraseña actual y la nueva.
     */
    void changePassword(String username, ChangePasswordRequest request);

    /**
     * Permite a un administrador resetear la contraseña de cualquier usuario.
     * @param request DTO con el username del usuario a resetear y la nueva contraseña.
     */
    void resetPassword(ResetPasswordRequest request);

    /**
     * Resetea la contraseña de un usuario a su nombre de usuario.
     * @param username Nombre del usuario.
     */
    void resetPasswordToUsername(String username);
}
