package com.zproject.zproject.insurance.domain.port.in;

import com.zproject.zproject.insurance.domain.model.Client;
import java.util.List;

/**
 * Puerto de entrada para la gestión de clientes.
 * Define las operaciones que la capa de aplicación debe implementar.
 */
public interface IClientUseCaseIn {
    /**
     * Crea un nuevo cliente.
     * @param client Datos del cliente.
     * @return Cliente creado.
     */
    Client createClient(Client client);

    /**
     * Actualiza un cliente existente.
     * @param id ID del cliente.
     * @param client Datos actualizados.
     * @return Cliente actualizado.
     */
    Client updateClient(Long id, Client client);

    /**
     * Elimina un cliente.
     * @param id ID del cliente.
     */
    void deleteClient(Long id);

    /**
     * Obtiene un cliente por ID.
     * @param id ID del cliente.
     * @return Cliente encontrado.
     */
    Client getClientById(Long id);

    /**
     * Busca clientes por criterios.
     * @param name Nombre.
     * @param email Email.
     * @param identificationNumber Identificación.
     * @return Lista filtrada.
     */
    List<Client> searchClients(String name, String email, String identificationNumber);
}
