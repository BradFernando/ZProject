package com.zproject.zproject.insurance.infrastructure.adapter.repository_jpa;

import com.zproject.zproject.insurance.domain.model.Policy;
import com.zproject.zproject.insurance.domain.port.out.IPolicyRepositoryOut;
import com.zproject.zproject.insurance.infrastructure.adapter.repository_jpa.entity.PolicyEntity;
import com.zproject.zproject.insurance.infrastructure.adapter.repository_jpa.mapper.PolicyEntityMapper;
import com.zproject.zproject.insurance.infrastructure.adapter.repository_jpa.repository.IPolicyJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Component
@Primary
@RequiredArgsConstructor
public class PolicyJpaRepositoryAdapter implements IPolicyRepositoryOut {

    private final IPolicyJpaRepository jpaRepository;

    @Override
    public Policy save(Policy policy) {
        PolicyEntity entity = PolicyEntityMapper.toEntity(policy);
        PolicyEntity savedEntity = jpaRepository.save(entity);
        return PolicyEntityMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Policy> findById(Long id) {
        return jpaRepository.findById(id).map(PolicyEntityMapper::toDomain);
    }

    @Override
    public List<Policy> findByClientId(Long clientId) {
        return jpaRepository.findByClientId(clientId).stream()
                .map(PolicyEntityMapper::toDomain)
                .toList();
    }

    @Override
    @Transactional
    public void deleteByClientId(Long clientId) {
        jpaRepository.deleteByClientId(clientId);
    }

    @Override
    public List<Policy> search(Policy.PolicyType type, Policy.PolicyStatus status, LocalDate startDateFrom, LocalDate startDateTo) {
        return jpaRepository.search(type, status, startDateFrom, startDateTo).stream()
                .map(PolicyEntityMapper::toDomain)
                .toList();
    }
}
