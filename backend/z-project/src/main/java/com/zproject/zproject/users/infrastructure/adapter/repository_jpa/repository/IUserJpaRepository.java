package com.zproject.zproject.users.infrastructure.adapter.repository_jpa.repository;

import com.zproject.zproject.users.infrastructure.adapter.repository_jpa.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repositorio JPA para la entidad UserEntity.
 */
public interface IUserJpaRepository extends JpaRepository<UserEntity, Long> {
    /**
     * Busca un usuario por su nombre de usuario. Solo devuelve usuarios activos.
     * @param username Nombre de usuario.
     * @return Usuario encontrado envuelto en un Optional.
     */
    @org.springframework.data.jpa.repository.Query("SELECT u FROM UserEntity u WHERE u.username = :username AND u.active = true")
    Optional<UserEntity> findByUsername(String username);

    /**
     * Busca un usuario por el ID del cliente asociado. Solo devuelve usuarios activos.
     * @param clientId ID del cliente.
     * @return Usuario encontrado envuelto en un Optional.
     */
    @org.springframework.data.jpa.repository.Query("SELECT u FROM UserEntity u WHERE u.client.id = :clientId AND u.active = true")
    Optional<UserEntity> findByClientId(Long clientId);

    /**
     * Busca cualquier usuario por el ID del cliente asociado, incluyendo inactivos.
     * Útil para reactivar o limpieza de auditoría.
     */
    Optional<UserEntity> findByClient_Id(Long clientId);
}
