import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeAccents',
  standalone: true
})
export class RemoveAccentsPipe implements PipeTransform {
  transform(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
