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

  grupo = signal('');
  usuario = signal('');
  contrasenia = signal('');
  
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    this.loading.set(true);
    this.errorMessage.set(null);

    const payload: ILoginRequest = {
      grupo: this.grupo(),
      usuario: this.usuario(),
      contrasenia: this.contrasenia()
    };

    this.authService.login(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']); // Redirigir a inicio (Home)
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.message);
      }
    });
  }
}