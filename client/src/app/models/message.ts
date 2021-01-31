export class Message{

  constructor(
    public _id:string,
    public emmiter:string,
    public receiver:string,
    public text:string,
    public created_at:string){}
}
