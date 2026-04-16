package com.zproject.zproject.insurance.domain.port.out;

import com.zproject.zproject.insurance.domain.model.Policy;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IPolicyRepositoryOut {
    Policy save(Policy policy);
    Optional<Policy> findById(Long id);
    List<Policy> findByClientId(Long clientId);
    void deleteByClientId(Long clientId);
    List<Policy> search(Policy.PolicyType type, Policy.PolicyStatus status, LocalDate startDateFrom, LocalDate startDateTo);
}
