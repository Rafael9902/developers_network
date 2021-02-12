import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { GLOBAL } from './global'

@Injectable()

export class UserService{

  public url:string;
  public identity;
  public token;
  public stats;

  constructor(public _http:HttpClient){
    this.url = GLOBAL.url;
  }

  register(user:User): Observable<any>{
      let params = JSON.stringify(user);
      let headers = new HttpHeaders().set('Content-Type', 'application/json');

      return this._http.post(this.url + 'register', params, {headers:headers});
  }

  signUp(user, gettoken = null): Observable<any>{

      if(gettoken != null) user.gettoken = gettoken;

      let params = JSON.stringify(user);
      let headers = new HttpHeaders().set('Content-Type', 'application/json');

      return this._http.post(this.url + 'login', params, {headers:headers});
  }

  getIdentity(){
      let identity = JSON.parse(localStorage.getItem('identity'));

      this.identity = identity != undefined ? identity : null;

      return this.identity;
  }

  getToken(){
      let token = localStorage.getItem('token');

      this.token = token != undefined ? token : null;

      return this.token;
  }


  getStats(){
    let stats = JSON.parse(localStorage.getItem('stats'));

    this.stats = stats != 'undefined' ? stats : null

    return this.stats;
  }

  getCounters(user_id = null): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());

    if(user_id != null){
      return this._http.get(this.url + 'counters/' + user_id, {headers: headers});
    }
    else{
      return this._http.get(this.url + 'counters', {headers: headers});
    }
  }




}
