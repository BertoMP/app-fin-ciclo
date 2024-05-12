import { Component } from '@angular/core';
import { CitasListModel } from '../../../../../core/interfaces/citas-list.model';
import { Observable, Subject, debounceTime } from 'rxjs';
import { CitasService } from '../../../../../core/services/citas.service';

@Component({
  selector: 'app-listado-citas',
  standalone: true,
  imports: [],
  templateUrl: './listado-citas.component.html',
  styleUrl: './listado-citas.component.scss'
})
export class ListadoCitasComponent {
  citas: CitasListModel;

  initialLoad: boolean = false;
  dataLoaded: boolean = false;

  isUserLoggedIn: boolean = false;
  userId: number;
  private getMedsSubject: Subject<void> = new Subject<void>();

  constructor(private citasService: CitasService) { }


  errores: string[];

  ngOnInit(): void {

    this.getMedsSubject
      .pipe(
        debounceTime(500)
      )
      .subscribe({
        next: () => {
          this.getMedicaciones();
        },
        error: (error: string[]) => {
          this.errores = error;
        }
      });
    this.initialLoad = true;
    this.getMedsSubject.next();
  }

  getMedicaciones() {
    let request: Observable<CitasListModel> = this.citasService.getCitas();

    request.subscribe({
      next: (response: CitasListModel) => {
        this.citas = response;

        console.log(this.citas);

        this.dataLoaded = true;
      },
      error: (error: string[]) => {
        this.errores = error;
      },
    });
  }

}
