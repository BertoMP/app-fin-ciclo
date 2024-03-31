import {FormControl, FormGroup} from "@angular/forms";

export class CustomValidators {
  static validEmail(control: FormControl): {[s: string]: boolean} | null {
    const value = control.value;
    const regex: RegExp = new RegExp('^[\\w.%+-]+@[a-z\\d]+(\\.[a-zA-Z]{2,})*$');

    if (!regex.test(value)) {
      return {'isInvalidMail': true}
    }

    return null;
  }

  static validName(control: FormControl): {[s: string]: boolean} | null {
    const value = control.value;
    const regex: RegExp
      = new RegExp('^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$');

    if (!regex.test(value)) {
      return {'isInvalidName': true}
    }

    return null;
  }

  static validSurname(control: FormControl): {[s: string]: boolean} | null {
    const value = control.value;
    const regex: RegExp
      = new RegExp('^((de|del|la)\\s)*[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+([\\s|\\-][A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$');

    if (!regex.test(value)) {
      return {'isInvalidSurname': true}
    }

    return null;
  }

  static validDni(control: FormControl): {[s: string]: boolean} | null {
    const value = control.value;
    const regex: RegExp = new RegExp('^[0-9]{8}[A-Z]$');

    if (!regex.test(value)) {
      return {'isInvalidDni': true}
    }

    return null;
  }

  static validDateOfBirth(control: FormControl): {[s: string]: boolean} | null {
    const value = control.value;
    const regex: RegExp = new RegExp('^\\d{4}-\\d{2}-\\d{2}$');

    if (!regex.test(value)) {
      return {'isInvalidDateOfBirth': true}
    }

    return null;
  }

  static validPassword(control: FormControl): {[s: string]: boolean} | null {
    const value = control.value;
    const regex: RegExp
      = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).{8,}$');

    if (!regex.test(value)) {
      return {'isInvalidPassword': true}
    }

    return null;
  }

  static validAddress(control: FormControl): {[s: string]: boolean} | null {
    const value = control.value;
    const regex: RegExp =
      new RegExp('^((de|del|la)\\s)*[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$');

    if (!regex.test(value)) {
      return {'isInvalidAddress': true}
    }

    return null;
  }

  static validNumber(control: FormControl): {[s: string]: boolean} | null {
    const value = control.value;
    const regex: RegExp = new RegExp('^[1-9]\\d{0,3}$');

    if (!regex.test(value)) {
      return {'isInvalidNumber': true}
    }

    return null;
  }

  static validDoor(control: FormControl): {[s: string]: boolean} | null {
    const value = control.value;
    const regex: RegExp = new RegExp('^(([1-9]\\d{0,3})|[A-ZÑ])$');

    if (!regex.test(value)) {
      return {'isInvalidDoor': true}
    }

    return null;
  }

  static validCity(control: FormControl): {[s: string]: boolean} | null {
    const value = control.value;
    const regex: RegExp
      = new RegExp('^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\\s(de|del|la))*(\\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$');

    if (!regex.test(value)) {
      return {'isInvalidCity': true}
    }

    return null;
  }

  static validPostalCode(control: FormControl): {[s: string]: boolean} | null {
    const value = control.value;
    const regex: RegExp = new RegExp('^\\d{5}$');

    if (!regex.test(value)) {
      return {'isInvalidPostalCode': true}
    }

    return null;
  }

  static validPhone(control: FormControl): {[s: string]: boolean} | null {
    const value = control.value;
    const regex: RegExp = new RegExp('^((\\+34|0034)\\s)?9[0-9]{8}$');

    if (!regex.test(value)) {
      return {'isInvalidPhone': true}
    }

    return null;
  }

  static validMobile(control: FormControl): {[s: string]: boolean} | null {
    const value = control.value;
    const regex: RegExp = new RegExp('^((\\+34|0034)\\s)?[67][0-9]{8}$');

    if (!regex.test(value)) {
      return {'isInvalidMobile': true}
    }

    return null;
  }
}
