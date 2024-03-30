import {FormControl} from "@angular/forms";

export class CustomValidators {
  static validEmail(control: FormControl): {[s: string]: boolean} | null {
    const value = control.value;
    const regex: RegExp = new RegExp('^[\\w.%+-]+@[a-z\\d]+(\\.[a-zA-Z]{2,})*$');

    if (!regex.test(value)) {
      return {'isInvalidMail': true}
    }

    return null;
  }
}
