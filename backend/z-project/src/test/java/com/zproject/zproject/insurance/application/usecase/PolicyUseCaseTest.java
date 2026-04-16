package com.zproject.zproject.insurance.application.usecase;

import com.zproject.zproject.insurance.domain.exception.DomainException;
import com.zproject.zproject.insurance.domain.exception.NotFoundException;
import com.zproject.zproject.insurance.domain.model.Client;
import com.zproject.zproject.insurance.domain.model.Policy;
import com.zproject.zproject.insurance.domain.port.out.IClientRepositoryOut;
import com.zproject.zproject.insurance.domain.port.out.IPolicyRepositoryOut;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PolicyUseCaseTest {

    @Mock
    private IPolicyRepositoryOut policyRepository;

    @Mock
    private IClientRepositoryOut clientRepository;

    @InjectMocks
    private PolicyUseCase policyUseCase;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createPolicy_ShouldSucceed_WhenClientExistsAndDatesValid() {
        // Arrange
        Long clientId = 1L;
        Policy policy = Policy.builder()
                .clientId(clientId)
                .startDate(LocalDate.now())
                .expirationDate(LocalDate.now().plusYears(1))
                .insuredAmount(new BigDecimal("1000"))
                .build();

        when(clientRepository.findById(clientId)).thenReturn(Optional.of(new Client()));
        when(policyRepository.save(any(Policy.class))).thenReturn(policy);

        // Act
        Policy result = policyUseCase.createPolicy(policy);

        // Assert
        assertNotNull(result);
        assertEquals(Policy.PolicyStatus.ACTIVA, policy.getStatus());
        verify(policyRepository, times(1)).save(policy);
    }

    @Test
    void createPolicy_ShouldThrowException_WhenDatesInvalid() {
        // Arrange
        Long clientId = 1L;
        Policy policy = Policy.builder()
                .clientId(clientId)
                .startDate(LocalDate.now().plusDays(5))
                .expirationDate(LocalDate.now())
                .insuredAmount(new BigDecimal("1000"))
                .build();

        when(clientRepository.findById(clientId)).thenReturn(Optional.of(new Client()));

        // Act & Assert
        DomainException exception = assertThrows(DomainException.class, () -> policyUseCase.createPolicy(policy));
        assertTrue(exception.getMessage().contains("fecha de expiración"));
    }

    @Test
    void createPolicy_ShouldThrowException_WhenClientNotFound() {
        // Arrange
        Long clientId = 1L;
        Policy policy = Policy.builder()
                .clientId(clientId)
                .build();

        when(clientRepository.findById(clientId)).thenReturn(Optional.empty());

        // Act & Assert
        NotFoundException exception = assertThrows(NotFoundException.class, () -> policyUseCase.createPolicy(policy));
        assertTrue(exception.getMessage().contains("Cliente no encontrado"));
    }
}
