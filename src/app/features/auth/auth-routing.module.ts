import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/containers/login/login.component';
import { GuestGuard } from './services/guest.guard';

const routes: Routes = [
  { path: 'auth/login', component: LoginComponent, canActivate: [GuestGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
