import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

/**
 * Interceptor global de errores HTTP.
 * Captura errores 401 para redirección al login, 403 para denegación de acceso,
 * 404 para recursos no encontrados y errores genéricos del servidor.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error inesperado';

      // Intentar extraer el mensaje de error del cuerpo de la respuesta
      const serverMessage = error.error?.message || error.error?.error || error.message;

      if (error.status === 401) {
        // El backend suele enviar 401 para credenciales inválidas o token expirado
        authService.logout();
        void router.navigate(['/auth/login']);
        errorMessage = serverMessage || 'Sesión expirada o credenciales inválidas.';
      } else if (error.status === 403) {
        errorMessage = 'Acceso denegado a este recurso.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado.';
      } else if (error.status === 400) {
        errorMessage = serverMessage || 'La solicitud es inválida.';
      } else if (error.status >= 500) {
        // Si es un 500 pero el mensaje indica Bad credentials (común en algunas configs de Spring Security)
        if (serverMessage?.toLowerCase().includes('bad credentials')) {
          errorMessage = 'Usuario o contraseña incorrectos.';
        } else {
          errorMessage = 'Error en el servidor. Intente más tarde.';
        }
      }

      // Mostrar notificación visual profesional
      messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 5000
      });

      return throwError(() => error);
    })
  );
};
