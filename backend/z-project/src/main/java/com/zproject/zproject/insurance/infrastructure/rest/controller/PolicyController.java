package com.zproject.zproject.insurance.infrastructure.rest.controller;

import com.zproject.zproject.insurance.application.dto.mapper.PolicyMapper;
import com.zproject.zproject.insurance.application.dto.request.PolicyRequest;
import com.zproject.zproject.insurance.application.dto.response.PolicyResponse;
import com.zproject.zproject.insurance.domain.model.Policy;
import com.zproject.zproject.insurance.domain.port.in.IPolicyUseCaseIn;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Controlador REST para la gestión de pólizas.
 * Permite emitir, cancelar y consultar pólizas de seguros.
 */
@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
@Tag(name = "Policy Management", description = "Endpoints para gestionar pólizas")
@SecurityRequirement(name = "bearerAuth")
public class PolicyController {

    private final IPolicyUseCaseIn policyUseCase;

    /**
     * Endpoint para asociar una nueva póliza a un cliente.
     *
     * @param request Datos de la póliza.
     * @return Respuesta con la póliza creada.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Asociar una nueva póliza a un cliente (Solo Admin)")
    public ResponseEntity<PolicyResponse> createPolicy(@Valid @RequestBody PolicyRequest request) {
        Policy policy = PolicyMapper.toModel(request);
        Policy createdPolicy = policyUseCase.createPolicy(policy);
        return new ResponseEntity<>(PolicyMapper.toResponse(createdPolicy), HttpStatus.CREATED);
    }

    /**
     * Endpoint para solicitar la cancelación de una póliza activa.
     *
     * @param id Identificador de la póliza.
     * @return Respuesta con la póliza en estado CANCELADA.
     */
    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CLIENT')")
    @Operation(summary = "Cancelar una póliza activa")
    public ResponseEntity<PolicyResponse> cancelPolicy(@PathVariable Long id) {
        Policy cancelledPolicy = policyUseCase.cancelPolicy(id);
        return ResponseEntity.ok(PolicyMapper.toResponse(cancelledPolicy));
    }

    /**
     * Endpoint para consultar todas las pólizas de un cliente.
     *
     * @param clientId Identificador del cliente.
     * @return Lista de pólizas asociadas al cliente.
     */
    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CLIENT')")
    @Operation(summary = "Consultar las pólizas de un cliente")
    public ResponseEntity<List<PolicyResponse>> getPoliciesByClient(@PathVariable Long clientId) {
        List<PolicyResponse> responses = policyUseCase.getPoliciesByClientId(clientId).stream()
                .map(PolicyMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    /**
     * Endpoint para buscar pólizas aplicando filtros de tipo, estado y fechas.
     *
     * @param type Tipo de póliza.
     * @param status Estado de la póliza.
     * @param startDateFrom Rango inicial de fecha de inicio.
     * @param startDateTo Rango final de fecha de inicio.
     * @return Lista de pólizas que coinciden con los filtros.
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Filtrar pólizas por tipo, estado o rango de fechas (Solo Admin)")
    public ResponseEntity<List<PolicyResponse>> searchPolicies(
            @RequestParam(required = false) Policy.PolicyType type,
            @RequestParam(required = false) Policy.PolicyStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDateTo) {
        
        List<PolicyResponse> responses = policyUseCase.searchPolicies(type, status, startDateFrom, startDateTo).stream()
                .map(PolicyMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }
}
