import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserComponent } from './components/user/user.component';

const app_routes: Routes = [
    {path: '', component:HomeComponent},
    {path: 'home', component:HomeComponent},
    {path: 'login', component:LoginComponent},
    {path: 'register', component:RegisterComponent},
    {path: 'my-data', component:UserEditComponent},
    {path: 'people', component:UserComponent},
    {path: 'people/:page', component:UserComponent},
    {path: '**', component:HomeComponent},
];

export const AppRoutingProviders: any[] = [];
export const routing:ModuleWithProviders<any> = RouterModule.forRoot(app_routes);
