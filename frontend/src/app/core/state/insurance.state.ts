import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ClientService } from '../services/client.service';
import { PolicyService } from '../services/policy.service';
import { Client, Policy } from '../models/insurance.models';
import * as Actions from './insurance.actions';
import { tap } from 'rxjs';

export interface InsuranceStateModel {
  clients: Client[];
  policies: Policy[];
  clientPolicies: Policy[];
  loading: boolean;
}

/**
 * Estado NGXS para la gestión de clientes y pólizas.
 * Centraliza la lógica de negocio y las peticiones al backend para el módulo de seguros.
 */
@State<InsuranceStateModel>({
  name: 'insurance',
  defaults: {
    clients: [],
    policies: [],
    clientPolicies: [],
    loading: false
  }
})
@Injectable()
export class InsuranceState {
  constructor(
    private clientService: ClientService,
    private policyService: PolicyService
  ) {}

  @Selector()
  static clients(state: InsuranceStateModel) { return state.clients; }

  @Selector()
  static policies(state: InsuranceStateModel) { return state.policies; }

  @Selector()
  static clientPolicies(state: InsuranceStateModel) { return state.clientPolicies; }

  @Selector()
  static loading(state: InsuranceStateModel) { return state.loading; }

  /**
   * Carga la lista de clientes (Solo Admin).
   */
  @Action(Actions.LoadClients)
  loadClients(ctx: StateContext<InsuranceStateModel>, { filters }: Actions.LoadClients) {
    ctx.patchState({ loading: true });
    return this.clientService.getClients(filters).pipe(
      tap({
        next: (clients) => ctx.patchState({ clients, loading: false }),
        error: () => ctx.patchState({ loading: false })
      })
    );
  }

  /**
   * Carga todas las pólizas del sistema (Solo Admin).
   */
  @Action(Actions.LoadPolicies)
  loadPolicies(ctx: StateContext<InsuranceStateModel>, { filters }: Actions.LoadPolicies) {
    ctx.patchState({ loading: true });
    return this.policyService.getPolicies(filters).pipe(
      tap({
        next: (policies) => ctx.patchState({ policies, loading: false }),
        error: () => ctx.patchState({ loading: false })
      })
    );
  }

  /**
   * Carga las pólizas asociadas a un cliente específico.
   */
  @Action(Actions.LoadClientPolicies)
  loadClientPolicies(ctx: StateContext<InsuranceStateModel>, { clientId }: Actions.LoadClientPolicies) {
    ctx.patchState({ loading: true });
    return this.policyService.getPoliciesByClient(clientId).pipe(
      tap({
        next: (clientPolicies) => ctx.patchState({ clientPolicies, loading: false }),
        error: () => ctx.patchState({ loading: false })
      })
    );
  }

  /**
   * Registra un nuevo cliente y lo añade al estado local.
   */
  @Action(Actions.CreateClient)
  createClient(ctx: StateContext<InsuranceStateModel>, { client }: Actions.CreateClient) {
    return this.clientService.createClient(client).pipe(
      tap(newClient => {
        const state = ctx.getState();
        ctx.patchState({ clients: [...state.clients, newClient] });
      })
    );
  }

  /**
   * Actualiza un cliente existente en el backend y el estado.
   */
  @Action(Actions.UpdateClient)
  updateClient(ctx: StateContext<InsuranceStateModel>, { id, client }: Actions.UpdateClient) {
    return this.clientService.updateClient(id, client).pipe(
      tap(updatedClient => {
        const state = ctx.getState();
        const clients = state.clients.map(c => c.id === id ? updatedClient : c);
        ctx.patchState({ clients });
      })
    );
  }

  /**
   * Desactiva un cliente (borrado lógico) y actualiza su estado en la caché.
   */
  @Action(Actions.DeleteClient)
  deleteClient(ctx: StateContext<InsuranceStateModel>, { id }: Actions.DeleteClient) {
    return this.clientService.deleteClient(id).pipe(
      tap(() => {
        const state = ctx.getState();
        const clients = state.clients.map(c => c.id === id ? { ...c, active: false } : c);
        ctx.patchState({ clients });
      })
    );
  }

  /**
   * Emite una nueva póliza y la vincula al cliente.
   */
  @Action(Actions.CreatePolicy)
  createPolicy(ctx: StateContext<InsuranceStateModel>, { policy }: Actions.CreatePolicy) {
    return this.policyService.createPolicy(policy).pipe(
      tap(newPolicy => {
        const state = ctx.getState();
        ctx.patchState({ policies: [...state.policies, newPolicy] });
      })
    );
  }

  /**
   * Cancela una póliza activa y actualiza ambos listados en el estado (Admin y Cliente).
   */
  @Action(Actions.CancelPolicy)
  cancelPolicy(ctx: StateContext<InsuranceStateModel>, { id }: Actions.CancelPolicy) {
    return this.policyService.cancelPolicy(id).pipe(
      tap(updatedPolicy => {
        const state = ctx.getState();
        const policies = state.policies.map(p => p.id === id ? updatedPolicy : p);
        const clientPolicies = state.clientPolicies.map(p => p.id === id ? updatedPolicy : p);
        ctx.patchState({ policies, clientPolicies });
      })
    );
  }
}
