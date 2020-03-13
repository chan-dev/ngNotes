import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '@shared/shared.module';
import { NotesRoutingModule } from './notes-routing.module';

import { NotesContainerComponent } from './containers/notes-container/notes-container.component';
import { NotesEffects } from './state/notes';
import { reducers } from './state';
import { SidenavContainerComponent } from './containers/sidenav-container/sidenav-container.component';
import { SidenavSearchComponent } from './components/sidenav-search/sidenav-search.component';
import { CurrentNoteHeaderComponent } from './components/current-note-header/current-note-header.component';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { CurrentNoteContainerComponent } from './containers/current-note-container/current-note-container.component';

@NgModule({
  declarations: [
    NotesContainerComponent,
    SidenavContainerComponent,
    SidenavSearchComponent,
    CurrentNoteHeaderComponent,
    NotesListComponent,
    CurrentNoteContainerComponent,
  ],
  imports: [
    SharedModule,
    NotesRoutingModule,
    StoreModule.forFeature('notes', reducers),
    EffectsModule.forFeature([NotesEffects]),
  ],
})
export class NotesModule {}