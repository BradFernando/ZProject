import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/insurance.models';
import { environment } from '../../../environments/environment';

/**
 * Servicio para la gestión de clientes.
 * Permite realizar operaciones CRUD y actualización de información de contacto.
 */
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly API_URL = `${environment.apiUrl}/clients`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Obtiene la lista de clientes con soporte para filtros de búsqueda.
   * @param filters Criterios de filtrado (nombre, email, identificación).
   */
  getClients(filters?: { name?: string, email?: string, identificationNumber?: string }): Observable<Client[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.name) params = params.set('name', filters.name);
      if (filters.email) params = params.set('email', filters.email);
      if (filters.identificationNumber) params = params.set('identificationNumber', filters.identificationNumber);
    }
    return this.http.get<Client[]>(this.API_URL, { params });
  }

  /**
   * Obtiene un cliente específico por su ID.
   */
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.API_URL}/${id}`);
  }

  /**
   * Crea un nuevo cliente en el sistema.
   */
  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.API_URL, client);
  }

  /**
   * Actualiza la información completa de un cliente.
   */
  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.API_URL}/${id}`, client);
  }

  /**
   * Elimina de forma permanente un cliente por su ID.
   */
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  /**
   * Permite actualizar parcialmente la información de contacto de un cliente.
   * Utilizado principalmente desde la vista de perfil del cliente.
   */
  updateContactInfo(id: number, address: string, phoneNumber: string): Observable<Client> {
    let params = new HttpParams();
    if (address) params = params.set('address', address);
    if (phoneNumber) params = params.set('phoneNumber', phoneNumber);
    // Se envía un objeto vacío en el cuerpo ya que los datos van por query params según el endpoint PATCH
    return this.http.patch<Client>(`${this.API_URL}/${id}/contact`, {}, { params });
  }
}
