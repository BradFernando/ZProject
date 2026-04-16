package com.zproject.zproject.users.infrastructure.adapter.repository_jwt;

import com.zproject.zproject.shared.services.JwtService;
import com.zproject.zproject.users.domain.port.out.ISecurityRepositoryOut;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

/**
 * Adaptador de seguridad para la implementación basada en JWT.
 * Implementa el puerto de salida de seguridad definido en el dominio.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SecurityJwtAdapter implements ISecurityRepositoryOut {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    /**
     * Realiza la autenticación del usuario utilizando AuthenticationManager.
     * @param username Nombre de usuario.
     * @param password Contraseña.
     */
    @Override
    public void authenticate(String username, String password) {
        log.info("[DEBUG_LOG] Intentando autenticar al usuario: {}", username);
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            log.info("[DEBUG_LOG] Autenticación exitosa para el usuario: {}", username);
        } catch (Exception e) {
            log.error("[DEBUG_LOG] Error en AuthenticationManager para {}: {}", username, e.getMessage());
            throw e;
        }
    }

    /**
     * Genera un token JWT utilizando el servicio de tokens.
     * @param user Detalles del usuario autenticado.
     * @return Token JWT generado.
     */
    @Override
    public String generateToken(UserDetails user) {
        log.info("[DEBUG_LOG] Generando token para el usuario: {}", user.getUsername());
        String token = jwtService.generateToken(user);
        log.info("[DEBUG_LOG] Token generado exitosamente para: {}", user.getUsername());
        return token;
    }
}
