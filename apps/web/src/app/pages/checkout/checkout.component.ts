import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { RechargeService } from '../../services/recharge.service';
import { AuthService } from '../../services/auth.service';
import { AuthModalService } from '../../services/auth-modal.service';
import { IVentaRequest, IProducto } from '@recarga/types';

type CheckoutStep = 'confirm' | 'processing' | 'success' | 'error';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  private rechargeService = inject(RechargeService);
  private authService = inject(AuthService);
  private authModal = inject(AuthModalService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  // Session
  session = this.authService.session;
  isLoggedIn = this.authService.isLoggedIn;

  // Productos
  productos = signal<IProducto[]>([]);
  loadingProductos = signal<boolean>(false);

  // Formulario Reactivo
  checkoutForm!: FormGroup;

  // Estado del flujo
  step = signal<CheckoutStep>('confirm');
  errorMessage = signal<string | null>(null);
  resultData = signal<any>(null);

  // Computed: producto seleccionado
  selectedProducto = computed(() => {
    const id = this.checkoutForm?.get('id_producto')?.value;
    return this.productos().find(p => p.id_producto === Number(id)) || null;
  });

  ngOnInit() {
    this.checkoutForm = this.fb.group({
      id_producto: [0, [Validators.required, Validators.min(1)]],
      cuenta: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],
      monto: [0, [Validators.required, Validators.min(1)]],
    });

    // Pre-cargar datos desde queryParams (flujo desde el recharge-form)
    this.route.queryParams.subscribe(params => {
      if (params['cuenta']) {
        this.checkoutForm.patchValue({ cuenta: params['cuenta'] });
      }
      if (params['monto']) {
        this.checkoutForm.patchValue({ monto: Number(params['monto']) });
      }
    });

    // Cargar productos si está logueado
    if (this.isLoggedIn()) {
      this.cargarProductos();
    }
  }

  cargarProductos() {
    if (this.loadingProductos()) return;
    this.loadingProductos.set(true);
    this.rechargeService.getProductos().subscribe({
      next: (res) => {
        this.loadingProductos.set(false);
        if (res.productos?.length) {
          this.productos.set(res.productos);
          // Si viene operadora de queryParams, preseleccionar por nombre
          this.route.queryParams.subscribe(params => {
            if (params['operadora'] && res.productos) {
              const match = res.productos.find(p =>
                p.nombre?.toLowerCase().includes(params['operadora'].toLowerCase())
              );
              if (match) {
                this.checkoutForm.patchValue({ id_producto: match.id_producto });
              }
            }
          });
        }
      },
      error: () => {
        this.loadingProductos.set(false);
      }
    });
  }

  openLogin() {
    this.authModal.open('login');
  }

  confirm(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    if (!this.isLoggedIn()) {
      this.authModal.open('login');
      return;
    }

    this.step.set('processing');
    this.errorMessage.set(null);

    const session = this.session()!;
    const formValue = this.checkoutForm.value;

    const payload: IVentaRequest = {
      id_vendedor: session.vendedor,
      grupo: session.grupo,
      id_producto: formValue.id_producto,
      cuenta: formValue.cuenta,
      monto: formValue.monto,
    };

    this.rechargeService.createRecharge(payload).subscribe({
      next: (res) => {
        this.resultData.set(res);
        this.step.set('success');
        // Actualizar saldo en sesión
        if (res.saldo !== undefined) {
          this.authService.updateSaldo(res.saldo);
        }
      },
      error: (err) => {
        this.errorMessage.set(err.message);
        this.step.set('error');
      }
    });
  }

  reset() {
    this.checkoutForm.reset({ id_producto: 0, cuenta: '', monto: 0 });
    this.step.set('confirm');
    this.errorMessage.set(null);
    this.resultData.set(null);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
