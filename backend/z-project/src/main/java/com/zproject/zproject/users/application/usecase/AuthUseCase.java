package com.zproject.zproject.users.application.usecase;

import com.zproject.zproject.users.application.dto.request.LoginRequest;
import com.zproject.zproject.users.application.dto.request.ChangePasswordRequest;
import com.zproject.zproject.users.application.dto.request.ResetPasswordRequest;
import com.zproject.zproject.users.application.dto.response.AuthResponse;
import com.zproject.zproject.users.domain.port.in.IAuthUseCaseIn;
import com.zproject.zproject.users.domain.port.out.ISecurityRepositoryOut;
import com.zproject.zproject.users.domain.port.out.IUserRepositoryOut;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Caso de uso para la autenticación y gestión de usuarios.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthUseCase implements IAuthUseCaseIn {

    private final ISecurityRepositoryOut securityRepository;
    private final IUserRepositoryOut userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("[DEBUG_LOG] Iniciando flujo de login para: {}", request.getUsername());
        
        // Autenticar al usuario
        securityRepository.authenticate(request.getUsername(), request.getPassword());

        log.info("[DEBUG_LOG] Buscando detalles del usuario en DB: {}", request.getUsername());
        // Obtener detalles del usuario
        UserDetails user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        log.info("[DEBUG_LOG] Generando JWT para: {}", request.getUsername());
        // Generar token
        String token = securityRepository.generateToken(user);

        log.info("[DEBUG_LOG] Login completado exitosamente para: {}", request.getUsername());
        return AuthResponse.builder()
                .token(token)
                .build();
    }

    @Override
    public void changePassword(String username, ChangePasswordRequest request) {
        log.info("[DEBUG_LOG] Usuario {} intentando cambiar su contraseña", username);
        
        UserDetails user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // Verificar contraseña actual
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            log.error("[DEBUG_LOG] Contraseña actual incorrecta para usuario: {}", username);
            throw new BadCredentialsException("La contraseña actual es incorrecta");
        }

        // Actualizar contraseña
        String encodedPassword = passwordEncoder.encode(request.getNewPassword());
        userRepository.updatePassword(username, encodedPassword);
        
        log.info("[DEBUG_LOG] Contraseña actualizada exitosamente para usuario: {}", username);
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        log.info("[DEBUG_LOG] Administrador reseteando contraseña para usuario: {}", request.getUsername());
        
        // Verificar existencia del usuario
        userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // Codificar y actualizar
        String encodedPassword = passwordEncoder.encode(request.getNewPassword());
        userRepository.updatePassword(request.getUsername(), encodedPassword);
        
        log.info("[DEBUG_LOG] Contraseña reseteada exitosamente por administrador para usuario: {}", request.getUsername());
    }

    @Override
    public void resetPasswordToUsername(String username) {
        log.info("[DEBUG_LOG] Administrador reseteando contraseña al nombre de usuario para: {}", username);
        
        // Verificar existencia del usuario
        userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // Codificar el username como contraseña
        String encodedPassword = passwordEncoder.encode(username);
        userRepository.updatePassword(username, encodedPassword);
        
        log.info("[DEBUG_LOG] Contraseña reseteada al username para: {}", username);
    }
}
