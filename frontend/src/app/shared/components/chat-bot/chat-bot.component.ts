import {Component, OnDestroy, OnInit} from '@angular/core';
import { ChatbotService } from '../../../core/services/chatbot.service';
import {Router, ResolveEnd, NavigationEnd, NavigationStart} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Subject} from "rxjs";

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.scss'
})
export class ChatBotComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private chatbotService: ChatbotService, private router: Router) {}

  ngOnInit(): void {
    if (!this.chatbotService.isLandbotVisible()) {
      this.chatbotService.initLandbot();
    }

    this.router.events.pipe(
      takeUntil(this.destroy$)
    ).subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (event.url.startsWith('/mediapp')) {
          this.chatbotService.removeLandbot();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
