import { Component, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent {
  isScrolled = signal(false);
  mobileMenuOpen = signal(false);

  constructor(private router: Router) {}

  @HostListener('window:scroll', [])
  onScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
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