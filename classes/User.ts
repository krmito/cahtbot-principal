export class User {
  phone: string = '';
  body: string = '';
  state: string = '';

  constructor(phone: string, body: string, state: string) {
    this.phone = phone;
    this.body = body;
    this.state = state;
  }

}
