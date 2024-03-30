export class UserModel {
  constructor(private name: string,
              private firstSurname: string,
              private idNumber: string,
              private gender: string,
              private secondSurname?: string,
              private mobilePhone?: string) {
    this.name = name;
    this.firstSurname = firstSurname
  }
}
