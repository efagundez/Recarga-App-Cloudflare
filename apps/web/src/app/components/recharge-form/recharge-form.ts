import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Operator {
  id: string;
  name: string;
  color: string;
  prefix: string[];
  icon: string;
}

interface RechargeAmount {
  value: number;
  label: string;
  popular?: boolean;
}

@Component({
  selector: 'app-recharge-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recharge-form.html',
  styleUrls: ['./recharge-form.scss']
})
export class RechargeFormComponent {
  operators: Operator[] = [
    { id: 'digitel', name: 'Digitel', color: '#E31837', prefix: ['412', '414'], icon: '🔴' },
    { id: 'movistar', name: 'Movistar', color: '#019DF4', prefix: ['416', '426'], icon: '🔵' },
    { id: 'movilnet', name: 'Movilnet', color: '#00A651', prefix: ['418', '428'], icon: '🟢' },
  ];

  amounts: RechargeAmount[] = [
    { value: 5, label: '$5' },
    { value: 10, label: '$10', popular: true },
    { value: 20, label: '$20' },
    { value: 50, label: '$50' },
    { value: 100, label: '$100' },
    { value: 200, label: '$200' },
  ];

  selectedOperator = signal<Operator | null>(null);
  selectedAmount = signal<number | null>(null);
  phoneNumber = signal('');
  step = signal(1); // 1: operator, 2: amount, 3: confirm

  selectOperator(op: Operator) {
    this.selectedOperator.set(op);
    this.step.set(2);
  }

  selectAmount(amount: number) {
    this.selectedAmount.set(amount);
    this.step.set(3);
  }

  onPhoneChange(value: string) {
    this.phoneNumber.set(value);
  }

  proceed() {
    // Handle navigation to checkout
    if (this.step() < 3) this.step.update(s => s + 1);
  }

  goBack() {
    if (this.step() > 1) this.step.update(s => s - 1);
  }

  isFormValid(): boolean {
    return !!(this.selectedOperator() && this.selectedAmount() && this.phoneNumber().length >= 10);
  }
}