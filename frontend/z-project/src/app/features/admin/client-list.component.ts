import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { InsuranceState } from '../../core/state/insurance.state';
import { Client } from '../../core/models/insurance.models';
import { LoadClients, DeleteClient, CreateClient, UpdateClient } from '../../core/state/insurance.actions';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ecuadorIdValidator } from '../../core/validators/ecuador-id.validator';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';

/**
 * Componente administrativo para la gestión de clientes.
 * Implementa listado, filtrado y operaciones CRUD mediante PrimeNG para una experiencia Senior.
 */
@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    CardModule,
    TooltipModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-card class="zurich-card shadow-1">
      <div class="flex justify-content-between align-items-center mb-5">
        <h2 class="m-0 zurich-text flex align-items-center text-3xl font-bold">
          <i class="pi pi-users mr-3 text-4xl"></i>
          Clientes
        </h2>
        <p-button label="Nuevo Cliente" icon="pi pi-plus" class="zurich-btn" (onClick)="openModal()"></p-button>
      </div>

      <!-- Filtros Compactos -->
      <div class="mb-5 p-4 bg-white border-round-xl border-1 border-200 shadow-1">
        <form [formGroup]="filterForm" (ngSubmit)="onFilter()" class="flex flex-wrap gap-3 align-items-end">
          <div class="flex-1 min-w-min">
            <label class="block text-sm font-semibold mb-2 text-600">Nombre</label>
            <span class="p-input-icon-left w-full">
              <i class="pi pi-user"></i>
              <input pInputText type="text" formControlName="name" placeholder="Ej: Juan Pérez" class="w-full">
            </span>
          </div>
          <div class="flex-1 min-w-min">
            <label class="block text-sm font-semibold mb-2 text-600">Email</label>
            <span class="p-input-icon-left w-full">
              <i class="pi pi-envelope"></i>
              <input pInputText type="text" formControlName="email" placeholder="ejemplo@correo.com" class="w-full">
            </span>
          </div>
          <div class="flex-1 min-w-min">
            <label class="block text-sm font-semibold mb-2 text-600">Identificación</label>
            <span class="p-input-icon-left w-full">
              <i class="pi pi-id-card"></i>
              <input pInputText type="text" formControlName="identificationNumber" placeholder="10 dígitos" class="w-full">
            </span>
          </div>
          <p-button type="submit" icon="pi pi-search" label="Buscar" class="p-button-outlined zurich-btn-secondary"></p-button>
          <p-button type="button" icon="pi pi-refresh" (onClick)="clearFilters()"
                    class="p-button-text p-button-secondary" pTooltip="Limpiar Filtros"></p-button>
        </form>
      </div>

      <p-table [value]="(clients$ | async) || []" [rows]="10" [paginator]="true"
               class="p-datatable-striped p-datatable-sm" responsiveLayout="scroll">
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="id">ID <p-sortIcon field="id"></p-sortIcon></th>
            <th pSortableColumn="identificationNumber">Identificación <p-sortIcon field="identificationNumber"></p-sortIcon></th>
            <th pSortableColumn="fullName">Nombre Completo <p-sortIcon field="fullName"></p-sortIcon></th>
            <th>Email</th>
            <th>Estado</th>
            <th class="text-center">Acciones</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-client>
          <tr>
            <td><span class="p-tag p-tag-info">{{ client.id }}</span></td>
            <td><strong>{{ client.identificationNumber }}</strong></td>
            <td>{{ client.fullName }}</td>
            <td>{{ client.email }}</td>
            <td>
              <span [class]="'p-tag ' + (client.active !== false ? 'p-tag-success' : 'p-tag-danger')">
                {{ client.active !== false ? 'ACTIVO' : 'INACTIVO' }}
              </span>
            </td>
            <td class="text-center">
              <div class="flex justify-content-center gap-2">
                @if (client.active !== false) {
                  <button pButton icon="pi pi-lock-open" class="p-button-rounded p-button-warning p-button-text"
                          (click)="onInitiateReset(client.identificationNumber)" pTooltip="Resetear Clave (a ID)"></button>
                  <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-info p-button-text"
                          (click)="openModal(client)" pTooltip="Editar"></button>
                  <button pButton icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text"
                          (click)="onDelete(client.id!)" pTooltip="Desactivar"></button>
                } @else {
                  <span class="text-500 text-sm italic">Sin acciones</span>
                }
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="6" class="text-center p-4 text-500">No se encontraron clientes que coincidan con los criterios.</td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>

    <!-- Dialogo de Edición/Creación -->
    <p-dialog [(visible)]="showModal" [header]="(editingClient ? 'Editar' : 'Nuevo') + ' Cliente'"
              [modal]="true" [style]="{ width: '450px' }" class="p-fluid">
      <ng-template pTemplate="content">
        <form [formGroup]="clientForm" class="flex flex-column gap-3 mt-2">
          <div class="field">
            <label for="idNum" class="font-bold">Número de Identificación</label>
            <input pInputText id="idNum" formControlName="identificationNumber" maxlength="10">
            @if (isInvalid('identificationNumber')) {
              @if (clientForm.get('identificationNumber')?.hasError('required')) {
                <small class="p-error">El número de identificación es obligatorio.</small>
              } @else if (clientForm.get('identificationNumber')?.hasError('pattern')) {
                <small class="p-error">Debe ser un número de exactamente 10 dígitos.</small>
              } @else if (clientForm.get('identificationNumber')?.hasError('invalidEcuadorId')) {
                <small class="p-error">{{ clientForm.get('identificationNumber')?.getError('invalidEcuadorId') }}</small>
              }
            }
          </div>
          <div class="field">
            <label for="fullName" class="font-bold">Nombre Completo</label>
            <input pInputText id="fullName" formControlName="fullName">
            @if (isInvalid('fullName')) {
              <small class="p-error">Solo letras y espacios son permitidos.</small>
            }
          </div>
          <div class="field">
            <label for="email" class="font-bold">Correo Electrónico</label>
            <input pInputText id="email" formControlName="email" type="email">
            @if (isInvalid('email')) {
              <small class="p-error">Ingrese un correo electrónico válido.</small>
            }
          </div>
          <div class="field">
            <label for="phone" class="font-bold">Teléfono de Contacto</label>
            <input pInputText id="phone" formControlName="phoneNumber">
            @if (isInvalid('phoneNumber')) {
              <small class="p-error">El teléfono es obligatorio.</small>
            }
          </div>
          <div class="field">
            <label for="address" class="font-bold">Dirección (Opcional)</label>
            <input pInputText id="address" formControlName="address">
          </div>
        </form>
      </ng-template>

      <ng-template pTemplate="footer">
        <p-button label="Cancelar" icon="pi pi-times" class="p-button-text" (onClick)="closeModal()"></p-button>
        <p-button label="Guardar" icon="pi pi-check" class="zurich-btn" (onClick)="onSave()" [disabled]="clientForm.invalid"></p-button>
      </ng-template>
    </p-dialog>

    <p-toast></p-toast>
  `
})
export class ClientListComponent implements OnInit {
  clients$: Observable<Client[]> = inject(Store).select(InsuranceState.clients);
  filterForm: FormGroup;
  clientForm: FormGroup;
  showModal = false;
  editingClient: Client | null = null;

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService,
    private readonly authService: AuthService,
    private readonly confirmationService: ConfirmationService
  ) {
    this.filterForm = this.fb.group({
      name: [''],
      email: [''],
      identificationNumber: ['']
    });

    this.clientForm = this.fb.group({
      identificationNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$'), ecuadorIdValidator()]],
      fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: ['']
    });
  }

  ngOnInit() {
    this.store.dispatch(new LoadClients());
  }

  onFilter() {
    this.store.dispatch(new LoadClients(this.filterForm.value));
  }

  /**
   * Limpia los filtros y recarga la lista completa de forma explícita.
   */
  clearFilters() {
    this.filterForm.reset();
    this.store.dispatch(new LoadClients());
  }

  onDelete(id: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea desactivar este cliente? Por motivos de auditoría, el registro permanecerá en el sistema pero no podrá acceder ni emitir nuevas pólizas.',
      header: 'Confirmar Desactivación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar Cliente',
      rejectLabel: 'Conservar Activo',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(new DeleteClient(id)).subscribe({
          next: () => this.messageService.add({
            severity: 'success',
            summary: 'Cliente Desactivado',
            detail: 'El registro ha sido marcado como inactivo para auditoría.'
          }),
          error: (err) => {
            const isBusinessError = err.status === 400 || err.error?.message?.includes('pólizas');
            this.messageService.add({
              severity: 'error',
              summary: isBusinessError ? 'Acción Denegada' : 'Error en la Operación',
              detail: isBusinessError
                ? 'El cliente no puede ser desactivado porque posee pólizas vigentes (activas).'
                : 'No se pudo completar la desactivación del registro.'
            });
          }
        });
      }
    });
  }

  openModal(client: Client | null = null) {
    this.editingClient = client;
    if (client) {
      this.clientForm.patchValue(client);
    } else {
      this.clientForm.reset();
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  isInvalid(control: string) {
    return this.clientForm.get(control)?.touched && this.clientForm.get(control)?.invalid;
  }

  /**
   * Resetea la contraseña de un usuario estableciéndola igual a su nombre de usuario.
   */
  onInitiateReset(username: string) {
    this.confirmationService.confirm({
      message: `¿Desea restablecer las credenciales de acceso para <strong>${username}</strong>? La nueva contraseña será automáticamente su número de identificación.`,
      header: 'Restablecer Contraseña',
      icon: 'pi pi-lock-open',
      acceptLabel: 'Restablecer ahora',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.authService.initiateReset(username).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Acceso Restablecido',
              detail: 'Se ha asignado el ID como nueva clave de acceso.'
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Fallo en el Reseteo',
              detail: err.error?.message || 'El sistema no pudo procesar el cambio de clave.'
            });
          }
        });
      }
    });
  }

  /**
   * Guarda o actualiza la información del cliente.
   * Valida identificación de 10 dígitos y formato de nombre.
   */
  onSave() {
    if (this.clientForm.invalid) return;
    const clientData = this.clientForm.value;

    const action = this.editingClient
      ? this.store.dispatch(new UpdateClient(this.editingClient.id!, clientData))
      : this.store.dispatch(new CreateClient(clientData));

    action.subscribe({
      next: () => {
        const detail = this.editingClient
          ? 'Los datos del cliente han sido actualizados con éxito.'
          : 'Cliente registrado. Su usuario y clave provisional son su número de identificación.';

        this.messageService.add({
          severity: 'success',
          summary: this.editingClient ? 'Perfil Actualizado' : 'Registro Exitoso',
          detail: detail
        });
        this.closeModal();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error de Validación',
          detail: 'No se pudo guardar la información. Por favor, revise los campos.'
        });
      }
    });
  }
}
