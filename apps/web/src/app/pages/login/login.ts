import { Component, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  // Servicios inyectados
  private authService = inject(AuthService);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);
  mode = signal<'login' | 'register'>('login');

  toggleMode() {
    this.mode.update(m => m === 'login' ? 'register' : 'login');
    this.errorMessage.set(null);
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    this.loading.set(true);
    this.errorMessage.set(null);

    const payload = {
      email: this.email(),
      password: this.password()
    };

    if (this.mode() === 'login') {
      this.authService.login(payload).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/']); // Redirigir a inicio (Home) tras loguear
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.message);
        }
      });
    } else {
      // Para el registro, generamos un nombre base de su email
      const name = this.email().split('@')[0];
      this.authService.register({ ...payload, name }).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.message);
        }
      });
    }
  }
}