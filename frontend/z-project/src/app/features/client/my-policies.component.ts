import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { InsuranceState } from '../../core/state/insurance.state';
import { Policy } from '../../core/models/insurance.models';
import { LoadClientPolicies, CancelPolicy } from '../../core/state/insurance.actions';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

/**
 * Vista del cliente para consultar sus propias pólizas.
 * Implementada con un diseño de tarjetas moderno y profesional de PrimeNG.
 */
@Component({
  selector: 'app-my-policies',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    DividerModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService],
  template: `
    <div class="mb-6 px-3">
      <h2 class="zurich-text flex align-items-center mb-2 text-4xl font-bold">
        <i class="pi pi-briefcase mr-3 text-5xl"></i>
        Mis Pólizas
      </h2>
      <p class="text-600 text-lg ml-1">Bienvenido a su área personal. Aquí puede gestionar sus coberturas Zurich.</p>
    </div>

    <div class="grid px-2">
      @for (policy of policies$ | async; track policy.id) {
        <div class="col-12 md:col-6 lg:col-4 p-3">
          <p-card class="zurich-card h-full shadow-1 hover:shadow-4 transition-all transition-duration-300 border-round-xl overflow-hidden">
            <ng-template pTemplate="header">
                <div class="p-4 zurich-bg flex justify-content-between align-items-center">
                    <span class="font-bold text-xl text-white">{{ policy.type }}</span>
                    <p-tag [value]="policy.status"
                           [severity]="policy.status === 'ACTIVA' ? 'success' : 'danger'"
                           class="shadow-2"></p-tag>
                </div>
            </ng-template>

            <div class="flex flex-column gap-4 py-3 px-2">
                <div class="flex justify-content-between align-items-center">
                    <span class="text-500 font-semibold uppercase text-xs tracking-wider">Número de Póliza</span>
                    <span class="font-bold text-900">#{{ policy.id }}</span>
                </div>

                <div class="bg-blue-50 p-3 border-round-lg flex flex-column gap-1">
                    <span class="text-600 text-xs font-bold uppercase">Suma Asegurada</span>
                    <span class="text-3xl font-black zurich-text">{{ policy.insuredAmount | currency:'USD' }}</span>
                </div>

                <div class="grid mt-2">
                    <div class="col-6 border-right-1 border-200">
                        <span class="block text-xs text-500 uppercase font-bold mb-2">Vigencia Desde</span>
                        <div class="flex align-items-center">
                            <i class="pi pi-calendar-plus mr-2 text-blue-500"></i>
                            <span class="text-sm font-semibold">{{ policy.startDate | date:'dd MMM, yyyy' }}</span>
                        </div>
                    </div>
                    <div class="col-6 pl-4">
                        <span class="block text-xs text-500 uppercase font-bold mb-2">Vencimiento</span>
                        <div class="flex align-items-center">
                            <i class="pi pi-calendar-minus mr-2 text-red-500"></i>
                            <span class="text-sm font-semibold text-red-600">{{ policy.expirationDate | date:'dd MMM, yyyy' }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <ng-template pTemplate="footer">
              <div class="pt-3">
                @if (policy.status === 'ACTIVA') {
                  <p-button label="Solicitar Cancelación" icon="pi pi-times-circle"
                            class="p-button-outlined p-button-danger w-full p-button-lg font-bold"
                            (onClick)="onCancel(policy.id!)"></p-button>
                } @else {
                  <p-button label="Póliza Inactiva" icon="pi pi-lock"
                            [disabled]="true"
                            class="p-button-text p-button-secondary w-full font-bold"></p-button>
                }
              </div>
            </ng-template>
          </p-card>
        </div>
      }
    </div>

    @if ((policies$ | async)?.length === 0) {
      <div class="flex flex-column align-items-center justify-content-center p-8 bg-white border-round shadow-1">
        <i class="pi pi-info-circle text-4xl text-500 mb-3"></i>
        <p class="text-xl font-medium text-700">No tienes pólizas asociadas en este momento.</p>
        <p class="text-500">Contacte a su asesor Zurich para más información.</p>
      </div>
    }

    <p-toast></p-toast>
  `
})
export class MyPoliciesComponent implements OnInit {
  policies$: Observable<Policy[]> = inject(Store).select(InsuranceState.clientPolicies);

  constructor(
    private readonly store: Store,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {}

  /**
   * Carga las pólizas del cliente logueado al iniciar el componente.
   */
  ngOnInit() {
    // Se obtiene el clientId desde el snapshot del estado de autenticación
    const clientId = this.store.selectSnapshot((state: any) => state.auth.clientId);
    if (clientId) {
      this.store.dispatch(new LoadClientPolicies(clientId));
    }
  }

  onCancel(id: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea solicitar la cancelación de esta póliza? Esta acción es irreversible y su cobertura cesará una vez procesada.',
      header: 'Confirmar Cancelación de Póliza',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cancelar póliza',
      rejectLabel: 'No, mantener cobertura',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.store.dispatch(new CancelPolicy(id)).subscribe({
          next: () => this.messageService.add({
            severity: 'success',
            summary: 'Solicitud Procesada',
            detail: 'La solicitud de cancelación ha sido registrada exitosamente.'
          }),
          error: () => this.messageService.add({
            severity: 'error',
            summary: 'Error del Sistema',
            detail: 'No se pudo procesar la cancelación en este momento. Por favor, intente más tarde.'
          })
        });
      }
    });
  }
}
