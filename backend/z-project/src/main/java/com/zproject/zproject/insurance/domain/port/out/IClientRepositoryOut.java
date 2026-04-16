package com.zproject.zproject.insurance.domain.port.out;

import com.zproject.zproject.insurance.domain.model.Client;
import java.util.List;
import java.util.Optional;

public interface IClientRepositoryOut {
    Client save(Client client);
    Optional<Client> findById(Long id);
    Optional<Client> findByIdentificationNumber(String identificationNumber);
    List<Client> findAll();
    void deleteById(Long id);
    List<Client> search(String name, String email, String identificationNumber);
}
