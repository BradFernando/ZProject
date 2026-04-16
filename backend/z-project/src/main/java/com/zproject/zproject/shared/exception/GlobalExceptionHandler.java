package com.zproject.zproject.shared.exception;

import com.zproject.zproject.insurance.domain.exception.DomainException;
import com.zproject.zproject.insurance.domain.exception.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Controlador global de excepciones para interceptar y estandarizar los errores de la API.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Captura excepciones de tipo NotFoundException (recursos no encontrados).
     *
     * @param ex La excepción capturada.
     * @return Respuesta con estado 404 y mensaje de error.
     */
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(NotFoundException ex) {
        return new ResponseEntity<>(new ErrorResponse(ex.getMessage(), LocalDateTime.now()), HttpStatus.NOT_FOUND);
    }

    /**
     * Captura excepciones de reglas de negocio (DomainException).
     *
     * @param ex La excepción capturada.
     * @return Respuesta con estado 400 y mensaje detallado.
     */
    @ExceptionHandler(DomainException.class)
    public ResponseEntity<ErrorResponse> handleDomain(DomainException ex) {
        return new ResponseEntity<>(new ErrorResponse(ex.getMessage(), LocalDateTime.now()), HttpStatus.BAD_REQUEST);
    }

    /**
     * Gestiona errores de validación de argumentos (@Valid).
     *
     * @param ex La excepción de validación.
     * @return Mapa de campos y mensajes de error específicos con estado 400.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    /**
     * Captura cualquier otra excepción no controlada explícitamente.
     *
     * @param ex La excepción general.
     * @return Respuesta genérica con estado 500.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobal(Exception ex) {
        return new ResponseEntity<>(new ErrorResponse("Ocurrió un error inesperado: " + ex.getMessage(), LocalDateTime.now()), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Registro DTO para representar una respuesta de error estandarizada.
     *
     * @param message Mensaje descriptivo del error.
     * @param timestamp Fecha y hora del suceso.
     */
    public record ErrorResponse(String message, LocalDateTime timestamp) {}
}
