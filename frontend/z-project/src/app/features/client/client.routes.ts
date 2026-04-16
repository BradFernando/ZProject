import { Routes } from '@angular/router';
import { LayoutComponent } from '../../shared/components/layout.component';
import { MyPoliciesComponent } from './my-policies.component';
import { ProfileComponent } from './profile.component';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'my-policies', component: MyPoliciesComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'my-policies', pathMatch: 'full' }
    ]
  }
];
