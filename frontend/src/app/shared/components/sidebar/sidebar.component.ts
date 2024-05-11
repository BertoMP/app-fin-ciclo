import {Component, Input} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../../../core/services/auth.service";
import {NgForOf} from "@angular/common";
import {PanelOptionModel} from "../../../core/interfaces/panel-option.model.js";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgForOf
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() mainOptions: PanelOptionModel[];
  @Input() secondaryOptions: PanelOptionModel[];
  @Input() title: string;

  optionSelected: boolean = false;

  constructor(private auth: AuthService,
              private router: Router) {
  }

  executeMethod(methodName: string): void {
    switch (methodName) {
      case 'onOptionSelected':
        this.onOptionSelected();
        break;
      case 'onLogout':
        this.onLogout();
        break;
      default:
        console.error(`Method ${methodName} not found`);
    }
  }

  onOptionSelected(): void {
    this.optionSelected = true;
  }

  onLogout() {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/'])
          .then(() => {})
          .catch(() => {});
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
