import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params }  from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [UserService]
})
export class UserComponent implements OnInit {
  public title: string;
  public identity;
  public token;
  public page;
  public nextPage;
  public prevPage;
  public status: string;
  public total;
  public pages;
  public users: User[];

  constructor(private _route:ActivatedRoute, private _router:Router, private _userService:UserService) {
    this.title = 'Personas';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    console.log('users');
    this.actualPage();
  }

  actualPage(){
      this._route.params.subscribe(params=>{
          let page = +params['page'];
          this.page = page;

          if(!page){
            page = 1;
          }
          else{
            this.nextPage = page + 1;
            this.prevPage = page - 1;

            if(this.prevPage <= 0) this.prevPage = 1;
          }

          this.getUsers(page);

      });
  }

  getUsers(page){
    this._userService.getUsers(page).subscribe(
        response =>{
          if(!response.users){
            this.status = 'error';
          }
          else{
            console.log(response.pages);
            this.users = response.users;
            this.pages  = response.pages;

            if(page > this.pages){
              this._router.navigate(['/people', 1]);
            }
          }

        },
        error =>{
          var errorMessage = <any>error;
          console.log(errorMessage);

          if(errorMessage != null) this.status = 'error';
        }
    );

  }

}
