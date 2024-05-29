import { Component, OnDestroy} from '@angular/core';
import { ChatBotComponent } from '../../shared/components/chat-bot/chat-bot.component';

@Component({
  selector: 'app-clinica',
  standalone: true,
  imports: [ChatBotComponent],
  templateUrl: './clinica.component.html',
  styleUrl: './clinica.component.scss'
})
export class ClinicaComponent{

}
