import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss']
})
export class HeroComponent {
  operators = [
    { name: 'Digitel', color: '#E31837', logo: '📱', description: '4G LTE' },
    { name: 'Movistar', color: '#019DF4', logo: '📡', description: '4G+' },
    { name: 'Movilnet', color: '#00A651', logo: '📶', description: '3G/4G' },
  ];
}