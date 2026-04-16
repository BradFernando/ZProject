package com.zproject.zproject.insurance.domain.port.in;

import com.zproject.zproject.insurance.domain.model.Policy;
import java.time.LocalDate;
import java.util.List;

/**
 * Puerto de entrada para la gestión de pólizas.
 * Define las operaciones que la capa de aplicación debe implementar.
 */
public interface IPolicyUseCaseIn {
    /**
     * Emite una nueva póliza.
     * @param policy Datos de la póliza.
     * @return Póliza creada.
     */
    Policy createPolicy(Policy policy);

    /**
     * Cancela una póliza activa.
     * @param id ID de la póliza.
     * @return Póliza cancelada.
     */
    Policy cancelPolicy(Long id);

    /**
     * Lista pólizas de un cliente.
     * @param clientId ID del cliente.
     * @return Lista de pólizas.
     */
    List<Policy> getPoliciesByClientId(Long clientId);

    /**
     * Busca pólizas por filtros.
     * @param type Tipo.
     * @param status Estado.
     * @param startDateFrom Fecha inicio desde.
     * @param startDateTo Fecha inicio hasta.
     * @return Lista filtrada.
     */
    List<Policy> searchPolicies(Policy.PolicyType type, Policy.PolicyStatus status, LocalDate startDateFrom, LocalDate startDateTo);
}
