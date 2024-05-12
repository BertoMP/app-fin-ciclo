import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MedicacionesService } from '../../../../../core/services/medicaciones.service';
import { MedicacionListModel } from '../../../../../core/interfaces/medicacion-list.model';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { saveAs } from 'file-saver';
import { FileDownloadService } from '../../../../../core/services/file-downloader.service';

@Component({
  selector: 'app-listado-medicacion',
  standalone: true,
  imports: [NgFor,
    NgIf, LoadingSpinnerComponent,
    FormsModule, RouterLink],
  templateUrl: './listado-medicacion.component.html',
  styleUrl: './listado-medicacion.component.scss'
})
export class ListadoMedicacionComponent implements OnInit {

  isUserLoggedIn: boolean = false;
  userId: number;
  loggedInSubscription: Subscription;
  prescripcionUser: MedicacionListModel;

  errores: string[];

  constructor(private medicacionesService: MedicacionesService,private descargarImagen:FileDownloadService) { }


  ngOnInit(): void {
    this.getMedicaciones();
  }

  getMedicaciones() {
    let request: Observable<MedicacionListModel> = this.medicacionesService.getMedicaciones();

    request.subscribe({
      next: (response) => {
        console.log(response);
        this.prescripcionUser = response;
      }
    });
  }

  downloadPrescripcion() {

    this.medicacionesService.getDownloadMedicacion().subscribe((response: any) => {
      const blob = new Blob([response]);
     saveAs(blob,'tomaMedicamentos.pdf');
    });

    
   
  }

}
