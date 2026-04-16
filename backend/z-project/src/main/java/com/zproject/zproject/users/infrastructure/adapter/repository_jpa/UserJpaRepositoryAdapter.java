package com.zproject.zproject.users.infrastructure.adapter.repository_jpa;

import com.zproject.zproject.users.domain.port.out.IUserRepositoryOut;
import com.zproject.zproject.users.infrastructure.adapter.repository_jpa.entity.UserEntity;
import com.zproject.zproject.users.infrastructure.adapter.repository_jpa.repository.IUserJpaRepository;
import com.zproject.zproject.insurance.infrastructure.adapter.repository_jpa.repository.IClientJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Adaptador de persistencia de usuarios para JPA.
 * Implementa el puerto de salida de dominio para desacoplar el núcleo de la infraestructura JPA.
 */
@Component
@RequiredArgsConstructor
public class UserJpaRepositoryAdapter implements IUserRepositoryOut {

    private final IUserJpaRepository userRepository;
    private final IClientJpaRepository clientRepository;

    /**
     * Busca un usuario en la base de datos por su nombre de usuario.
     * @param username Nombre de usuario a buscar.
     * @return El usuario encontrado como UserDetails envuelto en Optional.
     */
    @Override
    public Optional<UserDetails> findByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(UserDetails.class::cast);
    }

    /**
     * Actualiza la contraseña de un usuario en la base de datos.
     * @param username Nombre del usuario.
     * @param encodedPassword Contraseña ya codificada.
     */
    @Override
    @Transactional
    public void updatePassword(String username, String encodedPassword) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
        user.setPassword(encodedPassword);
        userRepository.save(user);
    }

    /**
     * Crea un nuevo usuario asociado a un cliente.
     */
    @Override
    @Transactional
    public void createUser(String username, String encodedPassword, Long clientId) {
        UserEntity user = UserEntity.builder()
                .username(username)
                .password(encodedPassword)
                .role(UserEntity.Role.CLIENT)
                .client(clientRepository.findById(clientId).orElse(null))
                .build();
        userRepository.save(user);
    }

    /**
     * Desactiva el usuario asociado a un cliente (borrado lógico).
     */
    @Override
    @Transactional
    public void deleteByClientId(Long clientId) {
        userRepository.findByClientId(clientId).ifPresent(user -> {
            user.setActive(false);
            userRepository.save(user);
        });
    }
}
