import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pacient-panel',
  standalone: true,
  imports: [RouterLink,RouterOutlet],
  templateUrl: './pacient-panel.component.html',
  styleUrl: './pacient-panel.component.scss'
})
export class PacientPanelComponent {
}
