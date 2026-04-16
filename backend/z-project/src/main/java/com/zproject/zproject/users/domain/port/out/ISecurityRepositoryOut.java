package com.zproject.zproject.users.domain.port.out;

import org.springframework.security.core.userdetails.UserDetails;

/**
 * Puerto de salida para la gestión de seguridad y tokens.
 */
public interface ISecurityRepositoryOut {
    /**
     * Autentica al usuario en el sistema de seguridad.
     * @param username Nombre de usuario.
     * @param password Contraseña.
     */
    void authenticate(String username, String password);

    /**
     * Genera un token para el usuario especificado.
     * @param user Detalles del usuario.
     * @return Token generado.
     */
    String generateToken(UserDetails user);
}
