import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthModalService {
  isOpen = signal<boolean>(false);
  activeTab = signal<'login' | 'register'>('login');

  open(tab: 'login' | 'register' = 'login') {
    this.activeTab.set(tab);
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen.set(false);
    document.body.style.overflow = '';
  }

  toggleTab() {
    this.activeTab.update(t => (t === 'login' ? 'register' : 'login'));
  }
}
