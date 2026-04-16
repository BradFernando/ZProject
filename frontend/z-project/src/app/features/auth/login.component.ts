import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { Login } from '../../core/state/auth.actions';
import { AuthState } from '../../core/state/auth.state';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';

/**
 * Componente para el inicio de sesión.
 * Maneja la autenticación y redirección inicial basada en el rol del usuario.
 * Utiliza PrimeNG para una interfaz profesional alineada con la marca Zurich.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    DividerModule
  ],
  template: `
    <div class="flex align-items-center justify-content-center min-h-screen bg-slate-50 p-3">
      <p-card class="zurich-card border-none shadow-8 overflow-hidden" [style]="{ width: '100%', maxWidth: '480px' }">
        <div class="zurich-bg p-5 text-center mb-5 -m-5">
          <div class="flex justify-content-center align-items-center mb-3">
            <i class="pi pi-shield text-5xl text-white mr-3"></i>
            <span class="text-4xl font-black tracking-tighter text-white">ZURICH</span>
          </div>
          <p class="text-white opacity-80 text-lg font-medium">Portal de Seguros</p>
        </div>

        <div class="px-2">
          <div class="text-center mb-5">
            <h3 class="text-2xl font-bold text-900 mb-2">Bienvenido</h3>
            <p class="text-500">Ingrese sus credenciales de acceso</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex flex-column gap-4">
            <div class="flex flex-column gap-2">
              <label for="username" class="font-bold text-700">Usuario</label>
              <div class="p-input-icon-left w-full">
                <i class="pi pi-user text-600"></i>
                <input pInputText id="username" type="text" formControlName="username"
                       placeholder="Nombre de usuario" class="w-full p-3"
                       [class.ng-invalid]="loginForm.get('username')?.touched && loginForm.get('username')?.invalid">
              </div>
              @if (loginForm.get('username')?.touched && loginForm.get('username')?.invalid) {
                <small class="p-error flex align-items-center gap-1">
                  <i class="pi pi-exclamation-circle text-xs"></i> El usuario es requerido.
                </small>
              }
            </div>

            <div class="flex flex-column gap-2">
              <label for="password" class="font-bold text-700">Contraseña</label>
              <p-password id="password" formControlName="password" [feedback]="false"
                          [toggleMask]="true" class="w-full" inputClass="w-full p-3"
                          placeholder="••••••••"
                          [class.ng-invalid]="loginForm.get('password')?.touched && loginForm.get('password')?.invalid"></p-password>
              @if (loginForm.get('password')?.touched && loginForm.get('password')?.invalid) {
                <small class="p-error flex align-items-center gap-1">
                  <i class="pi pi-exclamation-circle text-xs"></i> La contraseña es requerida.
                </small>
              }
            </div>

            @if (error) {
              <div class="p-3 border-round-lg bg-red-50 text-red-600 border-1 border-red-100 flex align-items-center gap-3">
                <i class="pi pi-times-circle text-xl"></i>
                <span class="font-medium">{{ error }}</span>
              </div>
            }

            <div class="mt-2">
              <p-button label="Ingresar al Sistema" type="submit" class="w-full zurich-btn p-button-lg shadow-2"
                        [loading]="loading" [disabled]="loginForm.invalid"></p-button>
            </div>
          </form>

          <p-divider align="center" class="my-6">
              <span class="text-400 text-xs font-bold uppercase tracking-widest">Garantía de Seguridad</span>
          </p-divider>

          <div class="text-center pb-2">
              <span class="text-400 text-xs">© 2026 Zurich Insurance Group.</span>
          </div>
        </div>
      </p-card>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly router: Router,
    private readonly ngZone: NgZone
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /**
   * Envía las credenciales al AuthService a través de NGXS.
   * Redirige al dashboard correspondiente según el rol decodificado.
   */
  onSubmit() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = null;
    console.log('[LoginComponent] Enviando login action');

    this.store.dispatch(new Login(this.loginForm.value)).subscribe({
      next: () => {
        const role = this.store.selectSnapshot(AuthState.role);

        const { username, password } = this.loginForm.value;
        const isResetPassword = username === password;

        // Forzar navegación dentro de la zona de Angular para evitar bloqueos
        this.ngZone.run(() => {
          setTimeout(() => {
            if (isResetPassword) {
              void this.router.navigate(['/auth/force-change-password']);
            } else if (role === 'ROLE_ADMIN' || (role?.includes('ADMIN'))) {
              void this.router.navigate(['/admin']);
            } else {
              void this.router.navigate(['/client']);
            }
          }, 0);
        });
      },
      error: (err: any) => {
        console.error('[LoginComponent] Error en dispatch:', err);
        this.loading = false;
        // Intentar obtener el mensaje amigable del error
        const serverMessage = err.error?.message || err.error?.error;
        if (serverMessage?.toLowerCase().includes('bad credentials')) {
          this.error = 'Las credenciales ingresadas son incorrectas. Por favor, verifique su usuario y contraseña.';
        } else if (err.status === 401) {
          this.error = 'Acceso denegado. No tiene permisos para ingresar al sistema.';
        } else if (err.status === 0) {
          this.error = 'No se pudo establecer conexión con el servidor. Verifique su conexión a internet.';
        } else {
          this.error = serverMessage || 'Ha ocurrido un error inesperado durante la autenticación. Intente nuevamente.';
        }
      }
    });
  }
}
