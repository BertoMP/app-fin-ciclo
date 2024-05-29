import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {ChatBotComponent} from "../../shared/components/chat-bot/chat-bot.component";

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    RouterLink,
    ChatBotComponent
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {
  constructor(private router: Router) {
  }

  goToIndex() {
    this.router.navigate(['/'])
      .then(() => console.log('Navegación a inicio'));
  }
}
