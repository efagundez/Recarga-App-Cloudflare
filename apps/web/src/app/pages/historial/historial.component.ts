import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { RechargeService } from '../../services/recharge.service';
import { AuthService } from '../../services/auth.service';
import { AuthModalService } from '../../services/auth-modal.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, RouterModule, DecimalPipe],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit {
  private rechargeService = inject(RechargeService);
  private authService = inject(AuthService);
  private authModal = inject(AuthModalService);
  private router = inject(Router);

  session = this.authService.session;
  isLoggedIn = this.authService.isLoggedIn;

  transacciones = signal<any[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  totalRecargado = signal<number>(0);
  totalComisiones = signal<number>(0);

  ngOnInit() {
    if (this.isLoggedIn()) {
      this.cargar();
    }
  }

  cargar() {
    this.loading.set(true);
    this.error.set(null);

    this.rechargeService.getTransacciones().subscribe({
      next: (res) => {
        const txList = res.transacciones || [];
        this.transacciones.set(txList);
        this.totalRecargado.set(txList.reduce((sum: number, tx: any) => sum + (tx.monto || 0), 0));
        this.totalComisiones.set(txList.reduce((sum: number, tx: any) => sum + (tx.comision || 0), 0));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Error al cargar el historial.');
        this.loading.set(false);
      }
    });
  }

  openLogin() {
    this.authModal.open('login');
  }
}
