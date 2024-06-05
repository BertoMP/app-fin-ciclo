import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {ChatBotComponent} from "../../shared/components/chat-bot/chat-bot.component";
import {Title} from "@angular/platform-browser";

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
export class PageNotFoundComponent implements OnInit {
  constructor(private router: Router,
              private title: Title) {
  }

  ngOnInit() {
    this.title.setTitle('404 - Página no encontrada');
  }

  goToIndex() {
    this.router.navigate(['/'])
      .then(() => {});
  }
}
