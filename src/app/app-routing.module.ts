import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './features/auth/services/auth.guard';

const routes: Routes = [
  {
    path: 'notes',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/notes/notes.module').then(m => m.NotesModule),
  },
  {
    path: '',
    redirectTo: '/notes',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
