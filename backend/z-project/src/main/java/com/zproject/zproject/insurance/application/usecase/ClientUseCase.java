package com.zproject.zproject.insurance.application.usecase;

import com.zproject.zproject.insurance.domain.exception.DomainException;
import com.zproject.zproject.insurance.domain.exception.NotFoundException;
import com.zproject.zproject.insurance.domain.model.Client;
import com.zproject.zproject.insurance.domain.port.in.IClientUseCaseIn;
import com.zproject.zproject.insurance.domain.port.out.IClientRepositoryOut;
import com.zproject.zproject.insurance.domain.port.out.IPolicyRepositoryOut;
import com.zproject.zproject.insurance.domain.model.Policy;
import com.zproject.zproject.users.domain.port.out.IUserRepositoryOut;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio de aplicación que implementa la lógica de negocio para la gestión de clientes.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ClientUseCase implements IClientUseCaseIn {

    private final IClientRepositoryOut clientRepository;
    private final IUserRepositoryOut userRepository;
    private final IPolicyRepositoryOut policyRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Registra un nuevo cliente en el sistema.
     * Valida que el número de identificación sea único y crea un usuario por defecto.
     *
     * @param client Datos del cliente a crear.
     * @return El cliente creado con su ID asignado.
     * @throws DomainException Si el número de identificación ya existe.
     */
    @Override
    @Transactional
    public Client createClient(Client client) {
        log.info("[DEBUG_LOG] Registrando nuevo cliente con identificación: {}", client.getIdentificationNumber());
        
        if (clientRepository.findByIdentificationNumber(client.getIdentificationNumber()).isPresent()) {
            log.error("[DEBUG_LOG] Error: Identificación duplicada {}", client.getIdentificationNumber());
            throw new DomainException("Ya existe un cliente con el número de identificación: " + client.getIdentificationNumber());
        }
        
        Client savedClient = clientRepository.save(client);
        log.info("[DEBUG_LOG] Cliente guardado exitosamente con ID: {}", savedClient.getId());

        // Crear usuario por defecto: username = identificación, password = identificación
        String defaultUsername = savedClient.getIdentificationNumber();
        String encodedPassword = passwordEncoder.encode(defaultUsername);
        
        userRepository.createUser(defaultUsername, encodedPassword, savedClient.getId());
        log.info("[DEBUG_LOG] Usuario de acceso creado automáticamente para el cliente. Username: {}", defaultUsername);

        return savedClient;
    }

    /**
     * Actualiza la información de un cliente existente.
     *
     * @param id Identificador del cliente.
     * @param client Nuevos datos del cliente.
     * @return El cliente actualizado.
     * @throws NotFoundException Si el cliente no existe.
     * @throws DomainException Si se intenta cambiar a un número de identificación ya usado.
     */
    @Override
    public Client updateClient(Long id, Client client) {
        Client existingClient = clientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cliente no encontrado con ID: " + id));
        
        // El número de identificación no debería cambiar según las historias, o si cambia debe ser único
        if (!existingClient.getIdentificationNumber().equals(client.getIdentificationNumber())) {
             if (clientRepository.findByIdentificationNumber(client.getIdentificationNumber()).isPresent()) {
                throw new DomainException("El nuevo número de identificación ya está en uso por otro cliente.");
            }
            existingClient.setIdentificationNumber(client.getIdentificationNumber());
        }

        existingClient.setFullName(client.getFullName());
        existingClient.setEmail(client.getEmail());
        existingClient.setPhoneNumber(client.getPhoneNumber());
        existingClient.setAddress(client.getAddress());

        return clientRepository.save(existingClient);
    }

    /**
     * Elimina un cliente por su identificador.
     * No se permite la eliminación si el cliente tiene pólizas activas.
     * Se realiza borrado en cascada del usuario y pólizas (canceladas).
     *
     * @param id Identificador del cliente.
     * @throws NotFoundException Si el cliente no existe.
     * @throws DomainException Si el cliente tiene pólizas en estado ACTIVA.
     */
    @Override
    @Transactional
    public void deleteClient(Long id) {
        log.info("[DEBUG_LOG] Intentando eliminar cliente con ID: {}", id);
        
        if (clientRepository.findById(id).isEmpty()) {
            log.error("[DEBUG_LOG] Error al eliminar: Cliente no encontrado con ID: {}", id);
            throw new NotFoundException("No se puede eliminar. Cliente no encontrado con ID: " + id);
        }

        // 1. Validar si tiene pólizas activas
        List<Policy> allPolicies = policyRepository.findByClientId(id);
        List<Policy> activePolicies = allPolicies.stream()
                .filter(p -> p.getStatus() == Policy.PolicyStatus.ACTIVA)
                .toList();

        if (!activePolicies.isEmpty()) {
            log.error("[DEBUG_LOG] No se puede eliminar el cliente ID: {}. Tiene {} pólizas activas.", id, activePolicies.size());
            throw new DomainException("No se puede eliminar el cliente porque tiene pólizas vigentes (activas).");
        }

        // 2. Borrado Lógico de Pólizas (las no activas, ej: CANCELADAS)
        // En este sistema las pólizas no tienen campo active, pero podemos dejar este paso.
        log.info("[DEBUG_LOG] Eliminando pólizas del cliente ID: {}", id);
        policyRepository.deleteByClientId(id);

        // 3. Borrado Lógico de Usuario de acceso
        log.info("[DEBUG_LOG] Desactivando usuario asociado al cliente ID: {}", id);
        userRepository.deleteByClientId(id);

        // 4. Borrado Lógico del registro del Cliente
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cliente no encontrado con ID: " + id));
        client.setActive(false);
        clientRepository.save(client);
        
        log.info("[DEBUG_LOG] Cliente con ID: {} desactivado exitosamente (borrado lógico).", id);
    }

    /**
     * Obtiene un cliente específico por su ID.
     *
     * @param id Identificador del cliente.
     * @return El cliente encontrado.
     * @throws NotFoundException Si el cliente no existe.
     */
    @Override
    public Client getClientById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cliente no encontrado con ID: " + id));
    }

    /**
     * Busca clientes aplicando filtros opcionales.
     *
     * @param name Nombre parcial o completo.
     * @param email Correo electrónico.
     * @param identificationNumber Número de identificación.
     * @return Lista de clientes que coinciden con los criterios.
     */
    @Override
    public List<Client> searchClients(String name, String email, String identificationNumber) {
        if (name == null && email == null && identificationNumber == null) {
            return clientRepository.findAll();
        }
        return clientRepository.search(name, email, identificationNumber);
    }
}
