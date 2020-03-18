import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '@shared/shared.module';
import { NotesRoutingModule } from './notes-routing.module';

import { NotesContainerComponent } from './containers/notes-container/notes-container.component';
import { NotesEffects } from './state/notes';
import { SidenavEffects } from './state/sidenav/sidenav.effects';
import { reducers } from './state';
import { SidenavContainerComponent } from './containers/sidenav-container/sidenav-container.component';
import { SidenavSearchComponent } from './components/sidenav-search/sidenav-search.component';
import { CurrentNoteHeaderComponent } from './components/current-note-header/current-note-header.component';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { CurrentNoteContainerComponent } from './containers/current-note-container/current-note-container.component';
import { SidenavMenusComponent } from './components/sidenav-menus/sidenav-menus.component';
import { createLocalStorageSyncReducer } from '@shared/helpers/localStorageSync';

const metaReducers = [
  createLocalStorageSyncReducer({
    keys: [{ notes: ['items', 'sharedItems'] }],
    rehydrate: true,
  }),
];

@NgModule({
  declarations: [
    NotesContainerComponent,
    SidenavContainerComponent,
    SidenavSearchComponent,
    CurrentNoteHeaderComponent,
    NotesListComponent,
    CurrentNoteContainerComponent,
    SidenavMenusComponent,
  ],
  imports: [
    SharedModule,
    NotesRoutingModule,
    StoreModule.forFeature('notes', reducers, { metaReducers }),
    EffectsModule.forFeature([NotesEffects, SidenavEffects]),
  ],
})
export class NotesModule {}
