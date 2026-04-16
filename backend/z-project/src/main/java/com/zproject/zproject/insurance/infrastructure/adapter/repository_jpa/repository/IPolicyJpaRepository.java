package com.zproject.zproject.insurance.infrastructure.adapter.repository_jpa.repository;

import com.zproject.zproject.insurance.domain.model.Policy.PolicyStatus;
import com.zproject.zproject.insurance.domain.model.Policy.PolicyType;
import com.zproject.zproject.insurance.infrastructure.adapter.repository_jpa.entity.PolicyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface IPolicyJpaRepository extends JpaRepository<PolicyEntity, Long> {
    List<PolicyEntity> findByClientId(Long clientId);
    void deleteByClientId(Long clientId);

    @Query("SELECT p FROM PolicyEntity p WHERE " +
            "(:type IS NULL OR p.type = :type) AND " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(CAST(:startDate AS localdate) IS NULL OR p.startDate >= :startDate) AND " +
            "(CAST(:endDate AS localdate) IS NULL OR p.expirationDate <= :endDate)")
    List<PolicyEntity> search(@Param("type") PolicyType type,
                               @Param("status") PolicyStatus status,
                               @Param("startDate") LocalDate startDate,
                               @Param("endDate") LocalDate endDate);
}
