import { Routes } from '@angular/router';
import { InitialFormComponent } from './initial-form/initial-form.component';
import { LoginFormComponent } from './login-form/login-form.component';

export const routes: Routes = [
    {
        path: 'home',
        component: InitialFormComponent
    },
    {
        path: 'login',
        component: LoginFormComponent
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: '**',
        component: InitialFormComponent
    }
];
