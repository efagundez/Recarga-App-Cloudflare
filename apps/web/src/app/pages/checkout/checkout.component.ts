import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { RechargeService } from '../../services/recharge.service';
import { IRechargeCreate, Operator } from '@recarga/types';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  /** Available operators in Venezuela. */
  operators: Operator[] = ['Movistar', 'Digitel', 'Movilnet'];

  /** Form payload – bound with ngModel in the template. */
  rechargePayload: IRechargeCreate = {
    phoneNumber: '',
    operator: 'Movistar',
    amount: 0,
  };

  /** UI state flags. */
  loading = false;
  errorMessage = '';

  constructor(
    private rechargeService: RechargeService,
    private router: Router
  ) {}

  /** Called when the user confirms the checkout. */
  confirm(): void {
    this.loading = true;
    this.errorMessage = '';

    this.rechargeService.createRecharge(this.rechargePayload).subscribe({
      next: () => {
        this.loading = false;
        alert('¡Recarga realizada con éxito!');
        this.router.navigate(['/historial']);
      },
      error: (err: Error) => {
        this.loading = false;
        this.errorMessage = err.message;
        console.error('Error al crear recarga', err);
      }
    });
  }
}
