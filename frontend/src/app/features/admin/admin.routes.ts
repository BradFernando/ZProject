import { Routes } from '@angular/router';
import { LayoutComponent } from '../../shared/components/layout.component';
import { ClientListComponent } from './client-list.component';
import { PolicyListComponent } from './policy-list.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'clients', component: ClientListComponent },
      { path: 'policies', component: PolicyListComponent },
      { path: '', redirectTo: 'clients', pathMatch: 'full' }
    ]
  }
];
