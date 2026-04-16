import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthResponse, DecodedToken } from '../models/insurance.models';
import { environment } from '../../../environments/environment';

/**
 * Servicio encargado de la autenticación y gestión de tokens JWT.
 * Implementa la persistencia local y decodificación del token para control de roles.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private readonly http: HttpClient) {}

  /**
   * Realiza el login y almacena el token en caso de éxito.
   * @param credentials Objeto con username y password.
   */
  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(res => this.setToken(res.token))
    );
  }

  /**
   * Elimina el token del almacenamiento local.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Persiste el token JWT en localStorage.
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Recupera el token almacenado.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Decodifica el token JWT para extraer la información del usuario y roles.
   * Utiliza la librería jwt-decode.
   */
  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }

  /**
   * Verifica si el usuario tiene una sesión activa y el token no ha expirado.
   */
  isLoggedIn(): boolean {
    const token = this.getDecodedToken();
    if (!token) return false;
    // Compara la fecha de expiración (en ms) con el tiempo actual
    return token.exp * 1000 > Date.now();
  }

  /**
   * Retorna el rol del usuario actual (ROLE_ADMIN o ROLE_CLIENT).
   */
  getRole(): string | null {
    const decoded: any = this.getDecodedToken();
    if (!decoded) {
      console.warn('[AuthService] No se pudo decodificar el token para obtener el rol');
      return null;
    }

    // 1. Intentar obtener de 'role' (string simple)
    let role = decoded.role || null;

    // 2. Intentar obtener de 'authorities' (Spring Security standard)
    if (!role && decoded.authorities && Array.isArray(decoded.authorities)) {
      const firstAuth = decoded.authorities[0];
      role = typeof firstAuth === 'string' ? firstAuth : firstAuth?.authority;
    }

    // 2b. Intentar obtener de 'roles' (Common variant)
    if (!role && decoded.roles && Array.isArray(decoded.roles)) {
      role = decoded.roles[0];
    }

    // 3. Caso especial de respaldo para 'admin' o 'cliente' basado en el prefijo del sub
    if (!role) {
      if (decoded.sub === 'admin') {
        role = 'ROLE_ADMIN';
      } else if (decoded.sub && decoded.sub.startsWith('cliente')) {
        role = 'ROLE_CLIENT';
      }
    }

    // 4. Normalizar el rol para que siempre tenga el prefijo ROLE_ y sea uppercase
    if (role) {
      role = role.toUpperCase();
      if (!role.startsWith('ROLE_')) {
        role = `ROLE_${role}`;
      }
    }

    return role;
  }

  /**
   * Genera un reseteo de contraseña para un usuario (Establece password = username) (Solo ADMIN).
   * @param username El nombre de usuario del cliente.
   */
  initiateReset(username: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/initiate-reset/${username}`, {});
  }

  /**
   * Resetea la contraseña de un usuario directamente (Solo ADMIN).
   * @param data Objeto con username y newPassword.
   */
  resetPassword(data: any): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/reset-password`, data);
  }

  /**
   * Cambia la contraseña propia del usuario logueado.
   * @param data Objeto con currentPassword y newPassword.
   */
  changePassword(data: any): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/change-password`, data);
  }
}
