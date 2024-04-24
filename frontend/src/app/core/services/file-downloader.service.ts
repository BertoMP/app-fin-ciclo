import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {
  constructor(private http: HttpClient) { }

  downloadFile(url: string, fileName: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' })
      .pipe(
        map(blob => {
          saveAs(blob, fileName);
          return blob;
        }),
        catchError(error => {
          console.error('Error downloading file:', error);
          return throwError(() => error);
        })
      );
  }
}
