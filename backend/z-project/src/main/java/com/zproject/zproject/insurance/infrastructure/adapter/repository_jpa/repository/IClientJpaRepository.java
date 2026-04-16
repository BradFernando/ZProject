package com.zproject.zproject.insurance.infrastructure.adapter.repository_jpa.repository;

import com.zproject.zproject.insurance.infrastructure.adapter.repository_jpa.entity.ClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IClientJpaRepository extends JpaRepository<ClientEntity, Long> {
    Optional<ClientEntity> findByIdentificationNumber(String identificationNumber);
    
    @Query("SELECT c FROM ClientEntity c WHERE c.active = true AND " +
            "(:name IS NULL OR LOWER(CAST(c.fullName AS string)) LIKE LOWER(CONCAT('%', CAST(:name AS string), '%'))) AND " +
            "(:email IS NULL OR LOWER(CAST(c.email AS string)) LIKE LOWER(CONCAT('%', CAST(:email AS string), '%'))) AND " +
            "(:identificationNumber IS NULL OR c.identificationNumber = :identificationNumber)")
    List<ClientEntity> search(@Param("name") String name, 
                               @Param("email") String email, 
                               @Param("identificationNumber") String identificationNumber);

    @Query("SELECT c FROM ClientEntity c WHERE c.active = true")
    List<ClientEntity> findAllActive();

    @Query("SELECT c FROM ClientEntity c WHERE c.active = true AND c.identificationNumber = :idNum")
    Optional<ClientEntity> findActiveByIdentificationNumber(@Param("idNum") String identificationNumber);

    @Query("SELECT c FROM ClientEntity c WHERE c.active = true AND c.id = :id")
    Optional<ClientEntity> findActiveById(@Param("id") Long id);
}
