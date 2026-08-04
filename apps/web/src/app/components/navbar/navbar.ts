import { Component, signal, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthModalService } from '../../services/auth-modal.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent {
  public authModal = inject(AuthModalService);
  private router = inject(Router);

  isScrolled = signal(false);
  mobileMenuOpen = signal(false);

  @HostListener('window:scroll', [])
  onScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  openLoginModal() {
    if (this.mobileMenuOpen()) {
      this.mobileMenuOpen.set(false);
    }
    this.authModal.open('login');
  }

  scrollToRecargar(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    if (this.mobileMenuOpen()) {
      this.mobileMenuOpen.set(false);
    }

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
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    });
  }
}