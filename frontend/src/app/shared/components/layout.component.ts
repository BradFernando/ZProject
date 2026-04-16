import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Logout } from '../../core/state/auth.actions';
import { AuthState } from '../../core/state/auth.state';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';

// PrimeNG Modules
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MenuItem, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

/**
 * Layout principal que define la estructura de navegación de la aplicación.
 * Implementa una barra de herramientas profesional con identidad visual Zurich.
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    ToolbarModule,
    ButtonModule,
    AvatarModule,
    MenuModule,
    TooltipModule,
    DialogModule,
    PasswordModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
    <header class="zurich-header shadow-4">
      <div class="header-container flex align-items-center justify-content-between px-4 py-2">
        <!-- Logo y Navegación Principal -->
        <div class="flex align-items-center gap-6">
          <div class="zurich-logo flex align-items-center cursor-pointer" routerLink="/">
            <i class="pi pi-shield text-3xl mr-2"></i>
            <span class="text-2xl font-bold tracking-tight">ZURICH</span>
          </div>

          <nav class="hidden lg:flex gap-1">
            @if ((role$ | async) === 'ROLE_ADMIN') {
              <a class="nav-item flex align-items-center px-3 py-2 border-round transition-colors"
                 routerLink="/admin/clients" routerLinkActive="active-nav">
                <i class="pi pi-users mr-2"></i>
                <span>Clientes</span>
              </a>
              <a class="nav-item flex align-items-center px-3 py-2 border-round transition-colors"
                 routerLink="/admin/policies" routerLinkActive="active-nav">
                <i class="pi pi-file mr-2"></i>
                <span>Pólizas</span>
              </a>
            }
            @if ((role$ | async) === 'ROLE_CLIENT') {
              <a class="nav-item flex align-items-center px-3 py-2 border-round transition-colors"
                 routerLink="/client/my-policies" routerLinkActive="active-nav">
                <i class="pi pi-list mr-2"></i>
                <span>Mis Pólizas</span>
              </a>
              <a class="nav-item flex align-items-center px-3 py-2 border-round transition-colors"
                 routerLink="/client/profile" routerLinkActive="active-nav">
                <i class="pi pi-user-edit mr-2"></i>
                <span>Mi Perfil</span>
              </a>
            }
          </nav>
        </div>

        <!-- Acciones de Usuario -->
        <div class="flex align-items-center gap-3">
          <div class="user-profile-badge flex align-items-center gap-3 pl-3 py-2 pr-2 border-round-3xl cursor-pointer hover:bg-white-alpha-10 transition-all shadow-hover"
               (click)="menu.toggle($event)">
            <div class="flex flex-column align-items-end hidden sm:flex text-white">
              <span class="text-sm font-bold">{{ user$ | async }}</span>
              <span class="text-xs font-medium opacity-80 uppercase tracking-widest">{{ (role$ | async) === 'ROLE_ADMIN' ? 'Administrador' : 'Cliente' }}</span>
            </div>
            <p-avatar [label]="(user$ | async)?.[0]?.toUpperCase()" shape="circle" size="large"
                      class="zurich-avatar-top shadow-2"></p-avatar>
            <i class="pi pi-chevron-down text-white-alpha-70 text-xs ml-1"></i>
          </div>
          <p-menu #menu [model]="menuItems" [popup]="true" styleClass="zurich-user-menu shadow-8 mt-2"></p-menu>
        </div>
      </div>
    </header>

    <main class="main-content container py-6 px-4 md:px-0">
      <router-outlet></router-outlet>
    </main>

    <!-- Diálogo de Cambio de Contraseña -->
    <p-dialog [(visible)]="changePasswordDialog" header="Cambiar Contraseña" [modal]="true"
              [style]="{ width: '400px' }" class="zurich-dialog">
      <form [formGroup]="changePasswordForm" (ngSubmit)="onChangePassword()" class="flex flex-column gap-3 mt-2">
        <div class="flex flex-column gap-2">
          <label for="currentPassword" class="font-semibold">Contraseña Actual</label>
          <p-password id="currentPassword" formControlName="currentPassword" [feedback]="false"
                      [toggleMask]="true" class="w-full" inputClass="w-full"></p-password>
        </div>
        <div class="flex flex-column gap-2">
          <label for="newPassword" class="font-semibold">Nueva Contraseña</label>
          <p-password id="newPassword" formControlName="newPassword" [toggleMask]="true"
                      class="w-full" inputClass="w-full" placeholder="Mínimo 6 caracteres"></p-password>
          @if (changePasswordForm.get('newPassword')?.touched && changePasswordForm.get('newPassword')?.invalid) {
            <small class="p-error">La contraseña debe tener al menos 6 caracteres.</small>
          }
        </div>
        <div class="flex justify-content-end gap-2 mt-3">
          <button pButton label="Cancelar" type="button" class="p-button-text" (click)="changePasswordDialog = false"></button>
          <button pButton label="Guardar" type="submit" class="zurich-btn"
                  [loading]="loading" [disabled]="changePasswordForm.invalid"></button>
        </div>
      </form>
    </p-dialog>

    <style>
      :host ::ng-deep .active-link {
        background: rgba(255, 255, 255, 0.2) !important;
        border-bottom: 2px solid white !important;
        border-radius: 4px 4px 0 0 !important;
      }
    </style>
  `
})
export class LayoutComponent implements OnInit {
  user$: Observable<string | null>;
  role$: Observable<string | null>;
  menuItems: MenuItem[] = [];

  changePasswordDialog = false;
  changePasswordForm: FormGroup;
  loading = false;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly messageService: MessageService
  ) {
    this.user$ = this.store.select(AuthState.user);
    this.role$ = this.store.select(AuthState.role);

    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.initMenu();
  }

  private initMenu() {
    this.menuItems = [
      {
        label: 'Perfil',
        items: [
          {
            label: 'Cambiar Contraseña',
            icon: 'pi pi-lock',
            command: () => this.showChangePasswordDialog()
          },
          {
            label: 'Mi Cuenta',
            icon: 'pi pi-user',
            visible: this.store.selectSnapshot(AuthState.role) === 'ROLE_CLIENT',
            command: () => void this.router.navigate(['/client/profile'])
          }
        ]
      },
      {
        separator: true
      },
      {
        label: 'Sesión',
        items: [
          {
            label: 'Cerrar Sesión',
            icon: 'pi pi-power-off',
            command: () => this.onLogout()
          }
        ]
      }
    ];
  }

  showChangePasswordDialog() {
    this.changePasswordForm.reset();
    this.changePasswordDialog = true;
  }

  onChangePassword() {
    if (this.changePasswordForm.invalid) return;
    this.loading = true;

    this.authService.changePassword(this.changePasswordForm.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Cambio Confirmado',
          detail: 'Su contraseña ha sido actualizada exitosamente en nuestros sistemas.'
        });
        this.loading = false;
        this.changePasswordDialog = false;
      },
      error: (err) => {
        this.loading = false;
        const errMsg = err.error?.message || 'No se pudo procesar el cambio de contraseña. Verifique sus datos e intente nuevamente.';
        this.messageService.add({
          severity: 'error',
          summary: 'Fallo en Operación',
          detail: errMsg
        });
      }
    });
  }

  onLogout() {
    this.store.dispatch(new Logout());
    void this.router.navigate(['/auth/login']);
  }
}
