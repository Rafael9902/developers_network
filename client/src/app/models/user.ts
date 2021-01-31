export class User{

    constructor(
      public _id:string,
      public name:string,
      public lastname:string,
      public nick:string,
      public email: String,
      public password: String,
      public role: String,
      public image: String){}
}
