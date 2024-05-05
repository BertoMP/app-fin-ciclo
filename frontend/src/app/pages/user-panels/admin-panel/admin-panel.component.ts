import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})

export class AdminPanelComponent{

}

