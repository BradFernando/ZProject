package com.zproject.zproject.users.domain.port.out;

import org.springframework.security.core.userdetails.UserDetails;
import java.util.Optional;

/**
 * Puerto de salida para la gestión de persistencia de usuarios.
 */
public interface IUserRepositoryOut {
    /**
     * Busca un usuario por su nombre de usuario.
     * @param username Nombre de usuario.
     * @return El usuario encontrado envuelto en un Optional.
     */
    Optional<UserDetails> findByUsername(String username);

    /**
     * Actualiza la contraseña de un usuario.
     * @param username Nombre del usuario.
     * @param encodedPassword Contraseña ya codificada.
     */
    void updatePassword(String username, String encodedPassword);

    /**
     * Crea un nuevo usuario asociado a un cliente.
     * @param username Nombre del usuario.
     * @param encodedPassword Contraseña codificada.
     * @param clientId ID del cliente asociado.
     */
    void createUser(String username, String encodedPassword, Long clientId);

    /**
     * Elimina el usuario asociado a un cliente.
     * @param clientId ID del cliente.
     */
    void deleteByClientId(Long clientId);
}
