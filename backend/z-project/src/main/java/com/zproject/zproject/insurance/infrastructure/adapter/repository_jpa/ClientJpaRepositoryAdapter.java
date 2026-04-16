package com.zproject.zproject.insurance.infrastructure.adapter.repository_jpa;

import com.zproject.zproject.insurance.domain.model.Client;
import com.zproject.zproject.insurance.domain.port.out.IClientRepositoryOut;
import com.zproject.zproject.insurance.infrastructure.adapter.repository_jpa.entity.ClientEntity;
import com.zproject.zproject.insurance.infrastructure.adapter.repository_jpa.mapper.ClientEntityMapper;
import com.zproject.zproject.insurance.infrastructure.adapter.repository_jpa.repository.IClientJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@Primary
@RequiredArgsConstructor
public class ClientJpaRepositoryAdapter implements IClientRepositoryOut {

    private final IClientJpaRepository jpaRepository;

    @Override
    public Client save(Client client) {
        ClientEntity entity = ClientEntityMapper.toEntity(client);
        ClientEntity savedEntity = jpaRepository.save(entity);
        return ClientEntityMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Client> findById(Long id) {
        return jpaRepository.findActiveById(id).map(ClientEntityMapper::toDomain);
    }

    @Override
    public Optional<Client> findByIdentificationNumber(String identificationNumber) {
        return jpaRepository.findActiveByIdentificationNumber(identificationNumber).map(ClientEntityMapper::toDomain);
    }

    @Override
    public List<Client> findAll() {
        return jpaRepository.findAllActive().stream()
                .map(ClientEntityMapper::toDomain)
                .toList();
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public List<Client> search(String name, String email, String identificationNumber) {
        return jpaRepository.search(name, email, identificationNumber).stream()
                .map(ClientEntityMapper::toDomain)
                .toList();
    }
}
