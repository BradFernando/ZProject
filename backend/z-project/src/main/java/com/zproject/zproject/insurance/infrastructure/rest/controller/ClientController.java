package com.zproject.zproject.insurance.infrastructure.rest.controller;

import com.zproject.zproject.insurance.application.dto.mapper.ClientMapper;
import com.zproject.zproject.insurance.application.dto.request.ClientRequest;
import com.zproject.zproject.insurance.application.dto.response.ClientResponse;
import com.zproject.zproject.insurance.domain.model.Client;
import com.zproject.zproject.insurance.domain.port.in.IClientUseCaseIn;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la gestión de clientes.
 * Expone endpoints para operaciones CRUD y búsqueda de clientes.
 */
@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@Tag(name = "Client Management", description = "Endpoints para gestionar clientes")
@SecurityRequirement(name = "bearerAuth")
public class ClientController {

    private final IClientUseCaseIn clientUseCase;

    /**
     * Endpoint para registrar un nuevo cliente.
     *
     * @param request Datos del cliente.
     * @return Respuesta con el cliente creado.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Registrar un nuevo cliente (Solo Admin)")
    public ResponseEntity<ClientResponse> createClient(@Valid @RequestBody ClientRequest request) {
        Client client = ClientMapper.toModel(request);
        Client createdClient = clientUseCase.createClient(client);
        return new ResponseEntity<>(ClientMapper.toResponse(createdClient), HttpStatus.CREATED);
    }

    /**
     * Endpoint para actualizar la información de un cliente.
     *
     * @param id Identificador del cliente.
     * @param request Nuevos datos.
     * @return Respuesta con el cliente actualizado.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Editar información de un cliente (Solo Admin)")
    public ResponseEntity<ClientResponse> updateClient(@PathVariable Long id, @Valid @RequestBody ClientRequest request) {
        Client client = ClientMapper.toModel(request);
        Client updatedClient = clientUseCase.updateClient(id, client);
        return ResponseEntity.ok(ClientMapper.toResponse(updatedClient));
    }

    /**
     * Endpoint para que un cliente actualice su dirección y teléfono.
     *
     * @param id Identificador del cliente.
     * @param address Nueva dirección.
     * @param phoneNumber Nuevo teléfono.
     * @return Respuesta con el cliente actualizado.
     */
    @PatchMapping("/{id}/contact")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    @Operation(summary = "Editar información personal: Dirección y teléfono")
    public ResponseEntity<ClientResponse> updateContactInfo(
            @PathVariable Long id,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String phoneNumber) {
        Client client = clientUseCase.getClientById(id);
        if (address != null) client.setAddress(address);
        if (phoneNumber != null) client.setPhoneNumber(phoneNumber);
        Client updatedClient = clientUseCase.updateClient(id, client);
        return ResponseEntity.ok(ClientMapper.toResponse(updatedClient));
    }

    /**
     * Endpoint para eliminar un cliente por su ID.
     *
     * @param id Identificador del cliente.
     * @return No Content en caso de éxito.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar un cliente (Solo Admin)")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientUseCase.deleteClient(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint para obtener los detalles de un cliente específico.
     *
     * @param id Identificador del cliente.
     * @return Respuesta con los datos del cliente.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CLIENT')")
    @Operation(summary = "Obtener un cliente por ID")
    public ResponseEntity<ClientResponse> getClientById(@PathVariable Long id) {
        Client client = clientUseCase.getClientById(id);
        return ResponseEntity.ok(ClientMapper.toResponse(client));
    }

    /**
     * Endpoint para listar o buscar clientes según diversos filtros.
     *
     * @param name Filtro por nombre.
     * @param email Filtro por correo.
     * @param identificationNumber Filtro por número de identificación.
     * @return Lista de clientes encontrados.
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar o filtrar clientes (Solo Admin)")
    public ResponseEntity<List<ClientResponse>> searchClients(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String identificationNumber) {
        
        List<ClientResponse> responses = clientUseCase.searchClients(name, email, identificationNumber).stream()
                .map(ClientMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }
}
