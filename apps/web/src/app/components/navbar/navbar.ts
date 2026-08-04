import { Component, signal, HostListener, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthModalService } from '../../services/auth-modal.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent {
  public authModal = inject(AuthModalService);
  public authService = inject(AuthService);
  private router = inject(Router);

  isScrolled = signal(false);
  mobileMenuOpen = signal(false);
  session = this.authService.session;
  isLoggedIn = this.authService.isLoggedIn;

  @HostListener('window:scroll', [])
  onScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  openLoginModal() {
    if (this.mobileMenuOpen()) this.mobileMenuOpen.set(false);
    this.authModal.open('login');
  }

  logout() {
    this.authService.logout();
  }

  scrollToRecargar(event?: Event) {
    if (event) event.preventDefault();
    if (this.mobileMenuOpen()) this.mobileMenuOpen.set(false);

    if (window.location.pathname === '/') {
      const elem = document.getElementById('formulario-recarga');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }

    this.router.navigate(['/'], { fragment: 'formulario-recarga' }).then(() => {
      setTimeout(() => {
        const elem = document.getElementById('formulario-recarga');
        if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    });
  }
}