package com.zproject.zproject.insurance.application.usecase;

import com.zproject.zproject.insurance.domain.exception.DomainException;
import com.zproject.zproject.insurance.domain.exception.NotFoundException;
import com.zproject.zproject.insurance.domain.model.Policy;
import com.zproject.zproject.insurance.domain.port.in.IPolicyUseCaseIn;
import com.zproject.zproject.insurance.domain.port.out.IClientRepositoryOut;
import com.zproject.zproject.insurance.domain.port.out.IPolicyRepositoryOut;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * Servicio de aplicación que gestiona el ciclo de vida de las pólizas de seguro.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PolicyUseCase implements IPolicyUseCaseIn {

    private final IPolicyRepositoryOut policyRepository;
    private final IClientRepositoryOut clientRepository;

    /**
     * Crea y asocia una nueva póliza a un cliente.
     * Valida la existencia del cliente y la coherencia de las fechas.
     *
     * @param policy Datos de la póliza a emitir.
     * @return La póliza creada con estado ACTIVA.
     * @throws NotFoundException Si el cliente asociado no existe.
     * @throws DomainException Si la fecha de expiración es inválida.
     */
    @Override
    public Policy createPolicy(Policy policy) {
        log.info("[DEBUG_LOG] Intentando crear póliza para cliente ID: {}", policy.getClientId());
        // Validar existencia del cliente
        if (clientRepository.findById(policy.getClientId()).isEmpty()) {
            log.error("[DEBUG_LOG] Cliente no encontrado con ID: {}", policy.getClientId());
            throw new NotFoundException("No se puede crear la póliza. Cliente no encontrado con ID: " + policy.getClientId());
        }

        // Validar fechas
        if (policy.getExpirationDate().isBefore(policy.getStartDate())) {
            log.error("[DEBUG_LOG] Fecha de expiración inválida para cliente ID: {}", policy.getClientId());
            throw new DomainException("La fecha de expiración debe ser posterior a la de inicio.");
        }

        // Establecer estado inicial
        policy.setStatus(Policy.PolicyStatus.ACTIVA);

        Policy savedPolicy = policyRepository.save(policy);
        log.info("[DEBUG_LOG] Póliza creada exitosamente con ID: {}", savedPolicy.getId());
        return savedPolicy;
    }

    /**
     * Cancela una póliza activa.
     *
     * @param id Identificador de la póliza.
     * @return La póliza en estado CANCELADA.
     * @throws NotFoundException Si la póliza no existe.
     * @throws DomainException Si la póliza ya estaba cancelada.
     */
    @Override
    public Policy cancelPolicy(Long id) {
        log.info("[DEBUG_LOG] Intentando cancelar póliza ID: {}", id);
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Póliza no encontrada con ID: " + id));

        if (policy.getStatus() == Policy.PolicyStatus.CANCELADA) {
            log.warn("[DEBUG_LOG] La póliza ID: {} ya estaba cancelada", id);
            throw new DomainException("La póliza ya se encuentra cancelada.");
        }

        policy.setStatus(Policy.PolicyStatus.CANCELADA);
        Policy savedPolicy = policyRepository.save(policy);
        log.info("[DEBUG_LOG] Póliza ID: {} cancelada exitosamente", id);
        return savedPolicy;
    }

    /**
     * Recupera todas las pólizas asociadas a un cliente.
     *
     * @param clientId Identificador del cliente.
     * @return Lista de pólizas del cliente.
     * @throws NotFoundException Si el cliente no existe.
     */
    @Override
    public List<Policy> getPoliciesByClientId(Long clientId) {
        log.info("[DEBUG_LOG] Buscando pólizas para cliente ID: {}", clientId);
        if (clientRepository.findById(clientId).isEmpty()) {
            log.error("[DEBUG_LOG] No se pueden buscar pólizas. Cliente no encontrado con ID: {}", clientId);
            throw new NotFoundException("Cliente no encontrado con ID: " + clientId);
        }
        List<Policy> policies = policyRepository.findByClientId(clientId);
        log.info("[DEBUG_LOG] Se encontraron {} pólizas para el cliente ID: {}", policies.size(), clientId);
        return policies;
    }

    /**
     * Busca pólizas utilizando criterios de filtrado avanzados.
     *
     * @param type Tipo de póliza.
     * @param status Estado de la póliza.
     * @param startDateFrom Fecha de inicio (rango inicial).
     * @param startDateTo Fecha de inicio (rango final).
     * @return Lista de pólizas que cumplen los criterios.
     */
    @Override
    public List<Policy> searchPolicies(Policy.PolicyType type, Policy.PolicyStatus status, LocalDate startDateFrom, LocalDate startDateTo) {
        return policyRepository.search(type, status, startDateFrom, startDateTo);
    }
}
