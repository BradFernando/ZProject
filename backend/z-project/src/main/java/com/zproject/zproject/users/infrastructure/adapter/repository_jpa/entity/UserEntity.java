package com.zproject.zproject.users.infrastructure.adapter.repository_jpa.entity;

import com.zproject.zproject.insurance.infrastructure.adapter.repository_jpa.entity.ClientEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Entidad JPA que representa a un usuario en el sistema.
 * Implementa UserDetails para la integración con Spring Security.
 */
@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity implements UserDetails {

    /**
     * Identificador único del usuario.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nombre de usuario único.
     */
    @Column(unique = true, nullable = false)
    private String username;

    /**
     * Contraseña codificada del usuario.
     */
    @Column(nullable = false)
    private String password;

    /**
     * Rol asignado al usuario (ADMIN o CLIENT).
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    /**
     * Cliente asociado al usuario (opcional).
     */
    @OneToOne
    @JoinColumn(name = "client_id")
    private ClientEntity client;

    /** Indica si el usuario está activo (borrado lógico). */
    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    /**
     * Enumeración de roles disponibles en el sistema.
     */
    public enum Role {
        ADMIN, CLIENT
    }

    /**
     * Devuelve las autoridades concedidas al usuario según su rol.
     * @return Colección de autoridades.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
}
