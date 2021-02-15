import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params }  from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'login',
    styleUrls: ['./login.component.css'],
    templateUrl: './login.component.html',
    providers: [UserService]
})

export class LoginComponent implements OnInit{
    public title:string;
    public user:User;
    public status:string;
    public identity;
    public token;
    public backgroundUrl;

    constructor(private _route:ActivatedRoute, private _router:Router, private _userService:UserService){
      this.title = 'Iniciar Sesión';
      this.user = new User("","","","","","","ROLE_USER","");
      this.backgroundUrl = "../../../assets/imgs/img1.jpg";
    }

    ngOnInit(){
      console.log('component loaded');
    }

    onSubmit(){
        //Login
        this._userService.signUp(this.user).subscribe(
            response =>{
                this.identity = response.user;

                if(!this.identity || !this.identity._id){
                    this.status = 'error';
                }
                else{
                    this.status = 'success';

                    //Persistence User Data
                    localStorage.setItem('identity', JSON.stringify(this.identity));

                    //Token
                    this.getToken()
                }

                //console.log(response.user);
                this.status = 'success';
            },
            error => {
                var error_message = <any>error;

                if(error_message != null){
                    this.status = 'error';
                    console.log(error_message);
                }

            }
        );
    }

    getToken(){
      //Login
      this._userService.signUp(this.user, 'true' ).subscribe(
          response =>{
              this.token = response.token;

              if(this.token.length <= 0){
                  this.status = 'error';
              }
              else{
                  //Persistence User Token
                  localStorage.setItem('token', JSON.stringify(this.token));

                  this.getCounters();
              }

              //console.log(response.user);
          },
          error => {
              var error_message = <any>error;

              if(error_message != null){
                  this.status = 'error';
                  console.log(error_message);
              }

          }
      );
    }

    getCounters(){
      this._userService.getCounters().subscribe(
        response =>{
          localStorage.setItem('stats', JSON.stringify(response));
          this.status = 'success';
          this._router.navigate(['/']);
        },
        error =>{
          console.log(<any>error);
        }
      )
    }
}
