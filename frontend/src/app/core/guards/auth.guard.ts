import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard de navegación para proteger rutas según autenticación y roles.
 * Verifica si el usuario está logueado y si posee el rol necesario definido en data['role'].
 */
export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const expectedRole = route.data['role'];
    const userRole = authService.getRole();

    // Normalización estricta para comparación
    const normalizedUserRole = userRole?.toUpperCase().replace('ROLE_', '') || null;
    const normalizedExpectedRole = expectedRole?.toUpperCase().replace('ROLE_', '') || null;

    if (!expectedRole || userRole === expectedRole || (normalizedUserRole && normalizedUserRole === normalizedExpectedRole)) {
      return true;
    }

    console.warn(`[AuthGuard] Acceso denegado. Redirigiendo a dashboard de ${userRole}`);

    // Si tiene un rol, pero no es el esperado, redirigir al dashboard correspondiente
    // Evitar bucles: solo navegar si NO estamos ya en la ruta destino
    if (userRole === 'ROLE_ADMIN') {
      if (!route.url.some(segment => segment.path.includes('admin'))) {
        void router.navigate(['/admin']);
      }
    } else if (!route.url.some(segment => segment.path.includes('client'))) {
      void router.navigate(['/client']);
    }
    return false;
  }

  console.warn('[AuthGuard] No logueado. Redirigiendo a login');
  // No está logueado, redirigir al login
  if (!route.url.some(segment => segment.path.includes('auth'))) {
    void router.navigate(['/auth/login']);
  }
  return false;
};
