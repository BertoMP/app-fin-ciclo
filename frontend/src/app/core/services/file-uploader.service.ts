import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();
      reader.onload = (event: any) => resolve(event.target.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }
}
