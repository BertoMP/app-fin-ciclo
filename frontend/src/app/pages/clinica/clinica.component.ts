import {Component, OnDestroy, OnInit} from '@angular/core';
import { ChatBotComponent } from '../../shared/components/chat-bot/chat-bot.component';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-clinica',
  standalone: true,
  imports: [ChatBotComponent],
  templateUrl: './clinica.component.html',
  styleUrl: './clinica.component.scss'
})
export class ClinicaComponent implements OnInit {
  constructor(private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('La clínica');
  }
}
