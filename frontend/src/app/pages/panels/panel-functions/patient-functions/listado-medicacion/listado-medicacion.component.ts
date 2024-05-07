import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-listado-medicacion',
  standalone: true,
  imports: [],
  templateUrl: './listado-medicacion.component.html',
  styleUrl: './listado-medicacion.component.scss'
})
export class ListadoMedicacionComponent implements OnInit{

  @Input('user_id') user_id:number;

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
