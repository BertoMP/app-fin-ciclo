import { Component } from '@angular/core';
import {
  HorizontalCardComponent
} from "../../shared/components/horizontal-card/horizontal-card.component";

@Component({
  selector: 'app-medical-specialties',
  standalone: true,
  imports: [
    HorizontalCardComponent
  ],
  templateUrl: './medical-specialties.component.html',
  styleUrl: './medical-specialties.component.css'
})
export class MedicalSpecialtiesComponent {
  infoCards: {
    title: string,
    description: string,
    image: string,
    buttons: {text: string, link: string}[],
    order: string
  }[] = [
    {
      title: 'Nuestras especialidades',
      description: 'Conoce las especialidades médicas que tenemos para ti.',
      image: 'assets/img/medical-specialities.jpg',
      buttons: [{
        text: 'Ver especialidades',
        link: '/nuestros-servicios/listado-de-especialidades',
      }],
      order: 'normal'
    },
    {
      title: 'Nuestros especialistas',
      description: 'Conoce a nuestros especialistas y agenda tu cita.',
      image: 'assets/img/medical-specialists.jpg',
      buttons: [{
        text: 'Ver especialistas',
        link: '/nuestros-servicios/listado-de-especialistas',
      }],
      order: 'reverse'
    }
  ]
}
