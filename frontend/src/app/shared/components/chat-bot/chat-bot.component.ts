import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ChatbotService } from '../../../core/services/chatbot.service';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.scss'
})
export class ChatBotComponent implements OnInit,OnDestroy {
  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    this.chatbotService.initLandbot();
  }

  ngOnDestroy(): void {
    this.chatbotService.removeLandbot();
  }

  @HostListener('window:mouseover', ['$event'])
  @HostListener('window:touchstart', ['$event'])
  onInitLandbot(event: Event): void {
    this.chatbotService.initLandbot();
  }

}
