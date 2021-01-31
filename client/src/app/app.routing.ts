import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes
import { LoginComponent } from './components/login/login.component'
import { RegisterComponent } from './components/register/register.component'

const app_routes: Routes = [
    {path: '', component:RegisterComponent},
    {path: 'login', component:LoginComponent},
    {path: 'register', component:RegisterComponent}
];

export const AppRoutingProviders: any[] = [];
export const routing:ModuleWithProviders<any> = RouterModule.forRoot(app_routes);
