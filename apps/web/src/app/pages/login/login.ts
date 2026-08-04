import { Component, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ILoginRequest } from '@recarga/types';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  activeTab = signal<'login' | 'register'>('login');

  // Form Fields
  grupo = signal('RECARGA1');
  usuario = signal('');
  contrasenia = signal('');
  
  // Register Fields
  regNombre = signal('');
  regUsuario = signal('');
  regContrasenia = signal('');

  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  showPassword = signal(false);

  setTab(tab: 'login' | 'register') {
    this.activeTab.set(tab);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  quickDemoLogin() {
    this.grupo.set('RECARGA1');
    this.usuario.set('ADMIN');
    this.contrasenia.set('admin123');
    this.onSubmit();
  }

  onSubmit() {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.activeTab() === 'login') {
      const payload: ILoginRequest = {
        grupo: this.grupo(),
        usuario: this.usuario(),
        contrasenia: this.contrasenia()
      };

      this.authService.login(payload).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.message || 'Error de autenticación. Verifica tus datos.');
        }
      });
    } else {
      // Registro Demo
      setTimeout(() => {
        this.loading.set(false);
        this.successMessage.set('¡Registro exitoso! Ya puedes iniciar sesión con tu cuenta.');
        this.setTab('login');
      }, 1000);
    }
  }
}