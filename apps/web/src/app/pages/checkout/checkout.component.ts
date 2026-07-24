import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { RechargeService } from '../../services/recharge.service';
import { IVentaRequest, IProducto } from '@recarga/types';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  productos: IProducto[] = [];
  
  rechargePayload: IVentaRequest = {
    id_vendedor: Number(localStorage.getItem('vendedor') || '0'),
    grupo: localStorage.getItem('grupo') || '',
    id_producto: 0,
    cuenta: '',
    monto: 0,
  };

  loading = false;
  errorMessage = '';

  constructor(
    private rechargeService: RechargeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.rechargeService.getProductos().subscribe({
      next: (res) => {
        if (res.productos) {
          this.productos = res.productos;
          if (this.productos.length > 0) {
            this.rechargePayload.id_producto = this.productos[0].id_producto;
          }
        }
      },
      error: (err) => console.error('Error cargando productos', err)
    });
  }

  confirm(): void {
    this.loading = true;
    this.errorMessage = '';

    this.rechargeService.createRecharge(this.rechargePayload).subscribe({
      next: (res) => {
        this.loading = false;
        alert(`¡Recarga aprobada!\nNro. Transacción: ${res.nro_transaccion}\nSaldo Restante: ${res.saldo}`);
        // Limpiar el form
        this.rechargePayload.cuenta = '';
        this.rechargePayload.monto = 0;
      },
      error: (err: Error) => {
        this.loading = false;
        this.errorMessage = err.message;
        console.error('Error al crear recarga', err);
      }
    });
  }
}
