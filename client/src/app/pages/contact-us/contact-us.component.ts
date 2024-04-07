import {Component} from '@angular/core';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})

export class ContactUsComponent {
  staticEmail: string = 'clinicaCoslada@info.es';
  staticUbication: string = 'Calle Coslada 4º 1ºB';
  staticTelef: string = '642 111 111';

  onClick(elemento:HTMLElement) {
    elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}