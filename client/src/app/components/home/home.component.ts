import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params }  from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    providers: [UserService]
})

export class HomeComponent implements OnInit{
    public title:string;

    constructor(){
        this.title = 'Bienvenido/a ';
    }

    ngOnInit(){
        console.log('home');
    }
}
