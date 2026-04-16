import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { InsuranceState } from '../../core/state/insurance.state';
import { Policy, Client } from '../../core/models/insurance.models';
import { LoadPolicies, CreatePolicy, LoadClients } from '../../core/state/insurance.actions';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

/**
 * Componente administrativo para el reporte y emisión de pólizas.
 * Utiliza PrimeNG para visualización avanzada y validaciones de negocio rigurosas.
 */
@Component({
  selector: 'app-policy-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    SelectModule,
    DatePickerModule,
    InputNumberModule,
    DialogModule,
    CardModule,
    TagModule,
    TooltipModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-card class="zurich-card shadow-1">
      <div class="flex justify-content-between align-items-center mb-5">
        <h2 class="m-0 zurich-text flex align-items-center text-3xl font-bold">
          <i class="pi pi-file-edit mr-3 text-4xl"></i>
          Pólizas
        </h2>
        <p-button label="Emitir Póliza" icon="pi pi-plus-circle" class="zurich-btn" (onClick)="openModal()"></p-button>
      </div>

      <!-- Filtros Compactos -->
      <div class="mb-5 p-4 bg-white border-round-xl border-1 border-200 shadow-1">
        <form [formGroup]="filterForm" (ngSubmit)="onFilter()" class="flex flex-wrap gap-3 align-items-end">
          <div class="flex-1 min-w-min">
            <label class="block text-sm font-semibold mb-2 text-600">Tipo</label>
            <p-select [options]="policyTypes" formControlName="type" placeholder="Todos" class="w-full"></p-select>
          </div>
          <div class="flex-1 min-w-min">
            <label class="block text-sm font-semibold mb-2 text-600">Estado</label>
            <p-select [options]="statusOptions" formControlName="status" placeholder="Todos" class="w-full"></p-select>
          </div>
          <div class="flex-1 min-w-min">
            <label class="block text-sm font-semibold mb-2 text-600">Desde</label>
            <input type="date" formControlName="startDateFrom" class="p-inputtext w-full">
          </div>
          <div class="flex-1 min-w-min">
            <label class="block text-sm font-semibold mb-2 text-600">Hasta</label>
            <input type="date" formControlName="startDateTo" class="p-inputtext w-full">
          </div>
          <p-button type="submit" icon="pi pi-filter" label="Filtrar" class="p-button-outlined zurich-btn-secondary"></p-button>
          <p-button type="button" icon="pi pi-refresh" (onClick)="filterForm.reset(); onFilter()"
                    class="p-button-text p-button-secondary" pTooltip="Limpiar Filtros"></p-button>
        </form>
      </div>

      <p-table [value]="(policies$ | async) || []" [rows]="10" [paginator]="true"
               class="p-datatable-striped p-datatable-sm" responsiveLayout="stack">
        <ng-template pTemplate="header">
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Tipo</th>
            <th>Vigencia</th>
            <th>Monto Asegurado</th>
            <th class="text-center">Estado</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-policy>
          <tr>
            <td><span class="text-500 font-bold">#{{ policy.id }}</span></td>
            <td>
              <div class="flex flex-column">
                <span class="font-bold">ID Cliente: {{ policy.clientId }}</span>
              </div>
            </td>
            <td>
              <p-tag [value]="policy.type" [severity]="getTypeSeverity(policy.type)"></p-tag>
            </td>
            <td>
              <div class="flex flex-column text-sm">
                <span><i class="pi pi-calendar-plus mr-1 text-xs"></i> {{ policy.startDate | date:'dd/MM/yyyy' }}</span>
                <span><i class="pi pi-calendar-minus mr-1 text-xs"></i> {{ policy.expirationDate | date:'dd/MM/yyyy' }}</span>
              </div>
            </td>
            <td class="font-bold text-blue-800">
              {{ policy.insuredAmount | currency:'USD':'symbol':'1.2-2' }}
            </td>
            <td class="text-center">
              <p-tag [value]="policy.status" [severity]="policy.status === 'ACTIVA' ? 'success' : 'danger'" [rounded]="true"></p-tag>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="6" class="text-center p-4 text-500">No se encontraron pólizas registradas.</td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>

    <!-- Dialogo de Emisión de Póliza -->
    <p-dialog [(visible)]="showModal" header="Emisión de Nueva Póliza"
              [modal]="true" [style]="{ width: '550px' }" class="p-fluid">
      <ng-template pTemplate="content">
        <form [formGroup]="policyForm" class="flex flex-column gap-4 mt-3">
          <div class="field">
            <label for="client" class="font-bold">Asociar Cliente</label>
            <p-select id="client" [options]="(clients$ | async) || []" formControlName="clientId"
                        optionLabel="fullName" optionValue="id" [filter]="true" filterBy="fullName,identificationNumber"
                        placeholder="Buscar cliente por nombre o ID" emptyMessage="No hay clientes registrados">
              <ng-template let-client pTemplate="item">
                <div class="flex flex-column">
                  <span class="font-bold">{{ client.fullName }}</span>
                  <small class="text-500">ID: {{ client.identificationNumber }}</small>
                </div>
              </ng-template>
            </p-select>
            @if (isInvalid('clientId')) {
              <small class="p-error">Debe seleccionar un cliente.</small>
            }
          </div>

          <div class="field">
            <label for="type" class="font-bold">Tipo de Cobertura</label>
            <p-select id="type" [options]="policyTypes" formControlName="type" placeholder="Seleccione tipo"></p-select>
          </div>

          <div class="grid">
            <div class="col-6 field">
              <label for="start" class="font-bold">Fecha de Inicio</label>
              <input type="date" formControlName="startDate" class="p-inputtext w-full">
              @if (isInvalid('startDate')) {
                <small class="p-error">Requerido.</small>
              }
            </div>
            <div class="col-6 field">
              <label for="end" class="font-bold">Fecha de Expiración</label>
              <input type="date" formControlName="expirationDate" class="p-inputtext w-full"
                     [class.ng-invalid]="policyForm.errors?.['dateError']">
              @if (policyForm.errors?.['dateError']) {
                <small class="p-error block">Debe ser posterior al inicio.</small>
              }
            </div>
          </div>

          <div class="field">
            <label for="amount" class="font-bold">Monto Asegurado ($)</label>
            <p-inputNumber id="amount" formControlName="insuredAmount" mode="currency" currency="USD" locale="en-US" [min]="0.01"></p-inputNumber>
            @if (isInvalid('insuredAmount')) {
              <small class="p-error">El monto debe ser un valor positivo.</small>
            }
          </div>
        </form>
      </ng-template>

      <ng-template pTemplate="footer">
        <p-button label="Cancelar" icon="pi pi-times" class="p-button-text" (onClick)="closeModal()"></p-button>
        <p-button label="Confirmar Emisión" icon="pi pi-check-circle" class="zurich-btn" (onClick)="onSave()" [disabled]="policyForm.invalid"></p-button>
      </ng-template>
    </p-dialog>

    <p-toast></p-toast>
  `
})
export class PolicyListComponent implements OnInit {
  policies$: Observable<Policy[]> = inject(Store).select(InsuranceState.policies);
  clients$: Observable<Client[]> = inject(Store).select(InsuranceState.clients);

  filterForm: FormGroup;
  policyForm: FormGroup;
  showModal = false;

  policyTypes = [
    { label: 'Vida', value: 'VIDA' },
    { label: 'Automóvil', value: 'AUTOMOVIL' },
    { label: 'Salud', value: 'SALUD' },
    { label: 'Hogar', value: 'HOGAR' }
  ];

  statusOptions = [
    { label: 'Activa', value: 'ACTIVA' },
    { label: 'Cancelada', value: 'CANCELADA' }
  ];

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService
  ) {
    this.filterForm = this.fb.group({
      type: [''],
      status: [''],
      startDateFrom: [''],
      startDateTo: ['']
    });

    this.policyForm = this.fb.group({
      clientId: [null, Validators.required],
      type: ['VIDA', Validators.required],
      startDate: ['', Validators.required],
      expirationDate: ['', Validators.required],
      insuredAmount: [1000, [Validators.required, Validators.min(0.01)]]
    }, { validators: [this.dateValidator] });
  }

  ngOnInit() {
    this.store.dispatch(new LoadPolicies());
    this.store.dispatch(new LoadClients());
  }

  onFilter() {
    this.store.dispatch(new LoadPolicies(this.filterForm.value));
  }

  openModal() {
    this.policyForm.reset({ type: 'VIDA', insuredAmount: 1000 });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  isInvalid(control: string) {
    return this.policyForm.get(control)?.touched && this.policyForm.get(control)?.invalid;
  }

  getTypeSeverity(type: string): "info" | "success" | "warn" | "danger" | "secondary" | "contrast" | undefined {
    switch (type) {
      case 'VIDA': return 'info';
      case 'AUTOMOVIL': return 'warn';
      case 'SALUD': return 'success';
      case 'HOGAR': return 'danger';
      default: return 'info';
    }
  }

  dateValidator(control: AbstractControl) {
    const start = control.get('startDate')?.value;
    const end = control.get('expirationDate')?.value;
    if (start && end && new Date(start) >= new Date(end)) {
      return { dateError: true };
    }
    return null;
  }

  onSave() {
    if (this.policyForm.invalid) return;
    const action = this.store.dispatch(new CreatePolicy(this.policyForm.value));
    action.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Emisión Exitosa',
          detail: 'La nueva póliza ha sido generada y asociada al cliente correctamente.'
        });
        this.closeModal();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Fallo en Emisión',
          detail: 'El sistema no pudo procesar la solicitud de nueva póliza. Verifique los datos.'
        });
      }
    });
  }
}
