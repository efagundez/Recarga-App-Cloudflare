import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroComponent } from '../../components/hero/hero';
import { RechargeFormComponent } from '../../components/recharge-form/recharge-form';

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface Testimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
  avatar: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, HeroComponent, RechargeFormComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  features: Feature[] = [
    {
      icon: '⚡',
      title: 'Entrega Instantánea',
      description: 'La recarga llega en menos de 30 segundos. Sin esperas, sin complicaciones.',
      color: 'hsl(45, 100%, 55%)'
    },
    {
      icon: '🔒',
      title: 'Pagos Seguros',
      description: 'Transacciones cifradas con SSL/TLS. Aceptamos múltiples formas de pago.',
      color: 'hsl(142, 76%, 42%)'
    },
    {
      icon: '🌍',
      title: 'Desde Cualquier País',
      description: 'Recarga el celular de un familiar en Venezuela desde donde estés en el mundo.',
      color: 'hsl(220, 82%, 48%)'
    },
    {
      icon: '📊',
      title: 'Historial Completo',
      description: 'Registro detallado de todas tus recargas. Fácil de consultar y exportar.',
      color: 'hsl(280, 75%, 55%)'
    },
    {
      icon: '🎧',
      title: 'Soporte 24/7',
      description: 'Equipo de soporte disponible para ayudarte en cualquier momento.',
      color: 'hsl(340, 82%, 55%)'
    },
    {
      icon: '💸',
      title: 'Mejores Tasas',
      description: 'Ofrecemos las mejores tasas de conversión y comisiones competitivas.',
      color: 'hsl(35, 95%, 55%)'
    },
  ];

  testimonials: Testimonial[] = [
    {
      name: 'María González',
      location: 'Madrid, España',
      text: 'Llevo 2 años usando RecargaVE para enviarle recargas a mi mamá. Es lo más rápido y confiable que he encontrado.',
      rating: 5,
      avatar: '👩‍🦱'
    },
    {
      name: 'Carlos Medina',
      location: 'Miami, EE.UU.',
      text: 'Excelente servicio. La recarga llega en segundos y el proceso es muy sencillo. 100% recomendado.',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Luisa Pérez',
      location: 'Bogotá, Colombia',
      text: 'Una maravilla. Puedo ayudar a mi familia en Venezuela sin complicaciones. El historial de pagos es muy útil.',
      rating: 5,
      avatar: '👩‍💻'
    },
  ];

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}