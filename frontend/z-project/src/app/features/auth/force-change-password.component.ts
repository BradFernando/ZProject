import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from 'primeng/api';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';

/**
 * Componente para el cambio obligatorio de contraseña.
 * Se activa cuando el usuario inicia sesión con su username como password (cuenta reseteada).
 */
@Component({
  selector: 'app-force-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    DividerModule
  ],
  template: `
    <div class="flex align-items-center justify-content-center min-h-screen bg-gray-100 p-3">
      <p-card class="zurich-card shadow-4" [style]="{ width: '100%', maxWidth: '450px' }">
        <div class="text-center mb-5">
          <div class="flex justify-content-center align-items-center mb-3">
            <i class="pi pi-lock-open zurich-text mr-2" style="font-size: 2.5rem"></i>
            <span class="text-3xl font-bold zurich-text">ZURICH</span>
          </div>
          <h2 class="text-900 font-bold mb-2">Cambio de Contraseña Obligatorio</h2>
          <p class="text-600 line-height-3">Su contraseña ha sido restablecida. Por seguridad, debe definir una nueva contraseña para continuar.</p>
        </div>

        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="flex flex-column gap-3">
          <div class="flex flex-column gap-2">
            <label for="newPassword" class="font-semibold">Nueva Contraseña</label>
            <p-password id="newPassword" formControlName="newPassword" [toggleMask]="true"
                        inputClass="w-full" class="w-full"
                        placeholder="Mínimo 6 caracteres"
                        [class.ng-invalid]="resetForm.get('newPassword')?.touched && resetForm.get('newPassword')?.invalid"
                        [class.ng-dirty]="resetForm.get('newPassword')?.touched"></p-password>
            @if (resetForm.get('newPassword')?.touched && resetForm.get('newPassword')?.invalid) {
              <small class="p-error">La contraseña debe tener al menos 6 caracteres.</small>
            }
          </div>

          <div class="flex flex-column gap-2">
            <label for="confirmPassword" class="font-semibold">Confirmar Contraseña</label>
            <p-password id="confirmPassword" formControlName="confirmPassword" [toggleMask]="true" [feedback]="false"
                        inputClass="w-full" class="w-full"
                        placeholder="Repita la contraseña"
                        [class.ng-invalid]="resetForm.get('confirmPassword')?.touched && resetForm.get('confirmPassword')?.invalid"
                        [class.ng-dirty]="resetForm.get('confirmPassword')?.touched"></p-password>
            @if (resetForm.get('confirmPassword')?.touched && resetForm.hasError('passwordMismatch')) {
              <small class="p-error">Las contraseñas no coinciden.</small>
            }
          </div>

          <div class="mt-4">
            <p-button label="Establecer Nueva Contraseña" type="submit" class="w-full zurich-btn"
                      [loading]="loading" [disabled]="resetForm.invalid"></p-button>
          </div>
        </form>

        <p-divider align="center" class="my-5">
            <span class="p-tag p-tag-rounded p-tag-info">Seguridad Zurich</span>
        </p-divider>

        <div class="text-center">
            <span class="text-500 text-xs">© 2026 Zurich Insurance Group.</span>
        </div>
      </p-card>
    </div>
  `,
  providers: [MessageService]
})
export class ForceChangePasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  resetForm!: FormGroup;
  loading = false;
  username: string = '';

  ngOnInit() {
    const decoded = this.authService.getDecodedToken();
    if (!decoded) {
      void this.router.navigate(['/auth/login']);
      return;
    }
    this.username = decoded.sub;

    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: [this.passwordMatchValidator] });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid) return;
    this.loading = true;

    // Usamos el username como "currentPassword" ya que es el mecanismo de reseteo
    const payload = {
      currentPassword: this.username,
      newPassword: this.resetForm.value.newPassword
    };

    this.authService.changePassword(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Cambio Confirmado',
          detail: 'Su nueva contraseña ha sido establecida con éxito. Redirigiendo al inicio de sesión...'
        });
        setTimeout(() => {
          this.authService.logout();
          void this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Fallo en la Actualización',
          detail: err.error?.message || 'El sistema no pudo procesar el cambio de contraseña. Por favor, intente de nuevo.'
        });
      }
    });
  }
}
