import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface Operator {
  id: string;
  name: string;
  color: string;
  prefix: string[];
  icon: string;
  logoUrl?: string;
}

export interface RechargeAmount {
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
  // Tasa de cambio referencial BCV
  tasaBcv = signal<number>(36.50);

  operators: Operator[] = [
    { id: 'movistar', name: 'Movistar', color: '#019DF4', prefix: ['414', '424', '0414', '0424'], icon: '🔵' },
    { id: 'digitel', name: 'Digitel', color: '#E31837', prefix: ['412', '0412'], icon: '🔴' },
    { id: 'movilnet', name: 'Movilnet', color: '#00A651', prefix: ['416', '426', '0416', '0426'], icon: '🟢' },
  ];

  amounts: RechargeAmount[] = [
    { value: 5, label: '$5' },
    { value: 10, label: '$10', popular: true },
    { value: 15, label: '$15' },
    { value: 20, label: '$20' },
    { value: 50, label: '$50' },
  ];

  selectedOperator = signal<Operator | null>(this.operators[0]);
  selectedAmount = signal<number>(10);
  customAmount = signal<number | null>(null);
  phoneNumber = signal<string>('');
  autoDetected = signal<boolean>(false);

  // Monto final seleccionado (preset o personalizado)
  finalAmount = computed(() => {
    return this.customAmount() && this.customAmount()! > 0
      ? this.customAmount()!
      : this.selectedAmount();
  });

  // Cálculo en Bolívares al cambio oficial
  montoBs = computed(() => {
    return (this.finalAmount() * this.tasaBcv()).toLocaleString('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  });

  constructor(private router: Router) {}

  selectOperator(op: Operator, manual = true) {
    this.selectedOperator.set(op);
    if (manual) {
      this.autoDetected.set(false);
    }
  }

  selectAmount(amount: number) {
    this.selectedAmount.set(amount);
    this.customAmount.set(null);
  }

  onCustomAmountInput(value: string) {
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && parsed > 0) {
      this.customAmount.set(parsed);
    } else {
      this.customAmount.set(null);
    }
  }

  onPhoneChange(rawPhone: string) {
    // Filtrar solo dígitos
    const clean = rawPhone.replace(/\D/g, '');
    this.phoneNumber.set(clean);

    // Autodetectar operadora por los primeros 3 o 4 dígitos
    if (clean.length >= 3) {
      const p3 = clean.substring(0, 3);
      const p4 = clean.substring(0, 4);

      const matched = this.operators.find(op => 
        op.prefix.includes(p3) || op.prefix.includes(p4)
      );

      if (matched) {
        this.selectedOperator.set(matched);
        this.autoDetected.set(true);
      }
    }
  }

  isFormValid(): boolean {
    const phone = this.phoneNumber();
    const amount = this.finalAmount();
    // Validar teléfono venezolano (10 o 11 dígitos, ej. 04141234567 o 4141234567)
    const validPhone = phone.length >= 10 && phone.length <= 11;
    const validAmount = amount > 0;
    return !!(this.selectedOperator() && validPhone && validAmount);
  }

  proceed() {
    if (!this.isFormValid()) return;

    // Navegar a Checkout con los datos pre-cargados
    this.router.navigate(['/checkout'], {
      queryParams: {
        operadora: this.selectedOperator()?.id,
        cuenta: this.phoneNumber(),
        monto: this.finalAmount(),
      }
    });
  }
}