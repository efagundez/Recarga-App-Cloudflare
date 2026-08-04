import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthModalService } from '../../services/auth-modal.service';
import { AuthService } from '../../services/auth.service';
import { ILoginRequest } from '@recarga/types';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent {
  public modalService = inject(AuthModalService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  loginForm: FormGroup;
  registerForm: FormGroup;

  loading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  showPassword = signal<boolean>(false);

  constructor() {
    this.loginForm = this.fb.group({
      grupo: ['RECARGA1', [Validators.required]],
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      contrasenia: ['', [Validators.required, Validators.minLength(4)]]
    });

    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      grupo: ['RECARGA1', [Validators.required]],
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      contrasenia: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  toggleShowPassword() {
    this.showPassword.update(v => !v);
  }

  setGrupo(grupo: string) {
    if (this.modalService.activeTab() === 'login') {
      this.loginForm.patchValue({ grupo });
    } else {
      this.registerForm.patchValue({ grupo });
    }
  }

  quickDemoLogin() {
    this.loginForm.patchValue({
      grupo: 'RECARGA1',
      usuario: 'ADMIN',
      contrasenia: 'admin123'
    });
    this.onLoginSubmit();
  }

  onLoginSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const payload: ILoginRequest = this.loginForm.value;

    this.authService.login(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('¡Acceso exitoso! Bienvenido.');
        setTimeout(() => {
          this.modalService.close();
          this.successMessage.set(null);
        }, 1200);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.message || 'Credenciales inválidas. Por favor intenta de nuevo.');
      }
    });
  }

  onRegisterSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    setTimeout(() => {
      this.loading.set(false);
      this.successMessage.set('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
      this.modalService.activeTab.set('login');
    }, 1200);
  }
}
