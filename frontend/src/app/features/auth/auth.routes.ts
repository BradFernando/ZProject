import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { ForceChangePasswordComponent } from './force-change-password.component';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'force-change-password', component: ForceChangePasswordComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
