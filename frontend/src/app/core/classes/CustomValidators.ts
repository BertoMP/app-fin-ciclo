import {
  AbstractControl,
  FormControl,
  FormGroup, ValidationErrors,
  ValidatorFn
} from "@angular/forms";

export class CustomValidators {
  static validEmail(control: FormControl): { [s: string]: boolean } | null {
    const value = control.value;
    const regex: RegExp = new RegExp('^[\\w.%+-]+@[a-z\\d]+(\\.[a-zA-Z]{2,})*$');

    if (!regex.test(value)) {
      return { 'isInvalidMail': true }
    }

    return null;
  }

  static validName(control: FormControl): { [s: string]: boolean } | null {
    const value = control.value;
    const regex: RegExp
      = new RegExp('^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$');

    if (!regex.test(value)) {
      return { 'isInvalidName': true }
    }

    return null;
  }

  static validSurname(control: FormControl): { [s: string]: boolean } | null {
    const value = control.value;
    const regex: RegExp
      = new RegExp('^((de|del|la)\\s)*[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+([\\s|\\-][A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$');

    if (!regex.test(value)) {
      return { 'isInvalidSurname': true }
    }

    return null;
  }

  static validDni(control: FormControl): { [s: string]: boolean } | null {
    const value = control.value;
    const regex: RegExp = new RegExp('^[0-9]{8}[A-Z]$');

    if (!regex.test(value)) {
      return { 'isInvalidDni': true }
    }

    return null;
  }

  static validDateOfBirth(control: FormControl): { [s: string]: boolean } | null {
    const value = control.value;
    const regex: RegExp = new RegExp('^\\d{4}-\\d{2}-\\d{2}$');

    const fecha_nacimiento = new Date(value);
    const fecha_actual = new Date();
    let edad = fecha_actual.getFullYear() - fecha_nacimiento.getFullYear();

    const mes = fecha_actual.getMonth() - fecha_nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && fecha_actual.getDate() < fecha_nacimiento.getDate())) {
      edad--;
    }

    if (!regex.test(value) || edad > 120 || edad < 0) {
      return { 'isInvalidDateOfBirth': true }
    }

    return null;
  }

  static validPassword(control: FormControl): { [s: string]: boolean } | null {
    const value = control.value;

    const regex =
      new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\\-_+=\\[\\]{}|;:,.<>?\\/]).{8,}$');


    if (!regex.test(value)) {
      return { 'isInvalidPassword': true }
    }

    return null;
  }

  static validAddress(control: FormControl): { [s: string]: boolean } | null {
    const value = control.value;
    const regex: RegExp =
      new RegExp('^((de|del|la)\\s)*[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$');

    if (!regex.test(value)) {
      return { 'isInvalidAddress': true }
    }

    return null;
  }

  static validNumber(control: FormControl): { [s: string]: boolean } | null {
    const value = control.value;
    const regex: RegExp = new RegExp('^[1-9]\\d{0,3}$');

    if (!regex.test(value)) {
      return { 'isInvalidNumber': true }
    }

    return null;
  }

  static validCollegiateNumber(control: FormControl): { [s: string]: boolean } | null {
    const value = control.value;
    const regex: RegExp = new RegExp('^[0-9]{9}$');

    if (!regex.test(value)) {
      return { 'isInvalidCollegiateNumber': true }
    }

    return null;
  }

  static validDoor(control: FormControl): { [s: string]: boolean } | null {
    const value = control.value;
    const regex: RegExp = new RegExp('^(([1-9]\\d{0,3})|[A-ZÑ])$');

    if (!regex.test(value)) {
      return { 'isInvalidDoor': true }
    }

    return null;
  }

  static validPostalCode(control: FormControl): { [s: string]: boolean } | null {
    const value = control.value;
    const regex: RegExp = new RegExp('^\\d{5}$');

    if (!regex.test(value)) {
      return { 'isInvalidPostalCode': true }
    }

    return null;
  }

  static validPhone(control: FormControl): { [s: string]: boolean } | null {
    const value = control.value;
    const regex: RegExp = new RegExp('^((\\+34|0034)\\s)?9[0-9]{8}$');

    if (!regex.test(value)) {
      return { 'isInvalidPhone': true }
    }

    return null;
  }

  static validMobile(control: FormControl): { [s: string]: boolean } | null {
    const value = control.value;
    const regex: RegExp = new RegExp('^((\\+34|0034)\\s)?[67][0-9]{8}$');

    if (!regex.test(value)) {
      return { 'isInvalidMobile': true }
    }

    return null;
  }

  static validPhoneMobile(control: FormControl): { [s: string]: boolean } | null {
    const value = control.value;
    const regex: RegExp = new RegExp('^((\\+34|0034)\\s)?[679][0-9]{8}$');

    if (!regex.test(value)) {
      return { 'isInvalidPhoneMobile': true }
    }

    return null;
  }

  static validMedicion(control: FormControl): { [s: string]: boolean } | null {
    const value=control.value;
    const regex:RegExp =new RegExp('^\\d{2,3}$');


    if(!regex.test(value))
      return { 'isInvalidGlucometria': true }

    return null;
  }

  static validConsulta(control: FormControl): { [s: string]: boolean } | null {
    const value = control.value;
    const regex: RegExp = new RegExp('^[1-9]\\d?-[A-Z]$');

    if (!regex.test(value)) {
      return { 'isInvalidConsulta': true }
    }

    return null;
  }

  static maxLengthHtml(maxLength: number): ValidatorFn {
    return (control: FormControl): {[key: string]: any} | null => {
      const value = control.value;
      const strippedValue = CustomValidators.#stripHtml(value);
      const isValid = strippedValue.length <= maxLength;
      return isValid ? null : { 'maxLengthHtml': { value: control.value } };
    };
  }

  static #stripHtml(html: string) {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  static dateValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = new Date(control.get('fechaInicio').value);
    const endDate = new Date(control.get('fechaFin').value);
    const now = new Date();

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    if (startDate < now) {
      return {'startDate': true};
    }

    if (endDate < now || endDate < startDate) {
      return {'endDate': true};
    }

    return null;
  }
}
