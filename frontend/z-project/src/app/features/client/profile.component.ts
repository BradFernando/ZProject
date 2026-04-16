import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { ClientService } from '../../core/services/client.service';
import { Client } from '../../core/models/insurance.models';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

/**
 * Componente para que el cliente gestione su información de contacto.
 * Utiliza componentes PrimeNG para una experiencia de usuario fluida y profesional.
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    DividerModule,
    MessageModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="flex flex-column align-items-center">
      <div class="w-full md:w-8 lg:w-6">
        <div class="mb-4">
          <h2 class="zurich-text flex align-items-center mb-1">
            <i class="pi pi-user-edit mr-3 text-4xl"></i>
            Gestión de Perfil
          </h2>
          <p class="text-500 ml-8">Actualice su información de contacto para recibir notificaciones de sus pólizas.</p>
        </div>

        <p-card class="zurich-card shadow-3">
          <form [formGroup]="profileForm" (ngSubmit)="onUpdate()" class="p-fluid grid">
            <div class="col-12 md:col-6 field mb-3">
              <label class="font-bold text-700 block mb-2">Nombre Completo</label>
              <div class="p-inputgroup">
                  <span class="p-inputgroup-addon"><i class="pi pi-user"></i></span>
                  <input type="text" pInputText [value]="client?.fullName" disabled class="bg-gray-100">
              </div>
            </div>

            <div class="col-12 md:col-6 field mb-3">
              <label class="font-bold text-700 block mb-2">Identificación</label>
              <div class="p-inputgroup">
                  <span class="p-inputgroup-addon"><i class="pi pi-id-card"></i></span>
                  <input type="text" pInputText [value]="client?.identificationNumber" disabled class="bg-gray-100">
              </div>
            </div>

            <div class="col-12 field mb-4">
              <p-divider align="left">
                <span class="p-tag p-tag-info">Datos Editables</span>
              </p-divider>
            </div>

            <div class="col-12 md:col-6 field mb-3">
              <label for="phone" class="font-bold block mb-2">Teléfono de Contacto</label>
              <span class="p-input-icon-left">
                  <i class="pi pi-phone"></i>
                  <input id="phone" type="text" pInputText formControlName="phoneNumber"
                         [class.ng-invalid]="profileForm.get('phoneNumber')?.invalid && profileForm.get('phoneNumber')?.touched">
              </span>
              @if (profileForm.get('phoneNumber')?.invalid && profileForm.get('phoneNumber')?.touched) {
                <small class="p-error">El teléfono es obligatorio.</small>
              }
            </div>

            <div class="col-12 md:col-6 field mb-3">
              <label for="address" class="font-bold block mb-2">Dirección Residencial</label>
              <span class="p-input-icon-left">
                  <i class="pi pi-map-marker"></i>
                  <input id="address" type="text" pInputText formControlName="address">
              </span>
            </div>

            <div class="col-12 mt-4">
              <p-button label="Guardar Cambios" icon="pi pi-save" type="submit"
                        class="zurich-btn" [loading]="loading" [disabled]="profileForm.invalid"></p-button>
            </div>
          </form>
        </p-card>
      </div>
    </div>
    <p-toast></p-toast>
  `
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  client: Client | null = null;
  loading = false;
  success = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly clientService: ClientService,
    private readonly messageService: MessageService
  ) {
    this.profileForm = this.fb.group({
      phoneNumber: ['', Validators.required],
      address: ['']
    });
  }

  ngOnInit() {
    const clientId = this.store.selectSnapshot((state: any) => state.auth.clientId);
    if (clientId) {
      this.clientService.getClientById(clientId).subscribe(client => {
        this.client = client;
        this.profileForm.patchValue({
          phoneNumber: client.phoneNumber,
          address: client.address
        });
      });
    }
  }

  onUpdate() {
    if (this.profileForm.invalid) return;
    const clientId = this.store.selectSnapshot((state: any) => state.auth.clientId);
    if (!clientId) return;

    this.loading = true;
    this.success = false;
    const { address, phoneNumber } = this.profileForm.value;

    this.clientService.updateContactInfo(clientId, address, phoneNumber).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Perfil Actualizado',
          detail: 'Su información de contacto ha sido guardada exitosamente.'
        });
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error de Actualización',
          detail: 'No se pudieron guardar los cambios. Verifique su conexión e intente nuevamente.'
        });
      }
    });
  }
}
