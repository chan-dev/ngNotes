import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as sidenavActions from '@app/features/notes/state/sidenav/sidenav.actions';
import * as noteActions from '@app/features/notes/state/notes/notes.actions';
import {
  getSidenavIsVisible,
  getSidenavSelectedMenu,
} from '../../state/sidenav/sidenav.selectors';

import { NoteWithFetchedTags } from '../../types/note';
import { getSelectedNoteWithTags } from '../../state/notes/notes.selectors';
import { SidenavMenus } from '../../state/sidenav/sidenav.state';

@Component({
  selector: 'app-current-note-container',
  templateUrl: './current-note-container.component.html',
  styleUrls: ['./current-note-container.component.scss'],
})
export class CurrentNoteContainerComponent implements OnInit {
  selectedNoteTitle$: Observable<string>;
  selectedNote$: Observable<NoteWithFetchedTags>;
  selectedMenu$: Observable<SidenavMenus>;
  sidenavVisible$: Observable<boolean>;

  constructor(private store: Store<any>) {
    this.selectedNote$ = this.store.select(getSelectedNoteWithTags);
    this.sidenavVisible$ = this.store.select(getSidenavIsVisible);
    this.selectedMenu$ = this.store.select(getSidenavSelectedMenu);
  }

  ngOnInit() {}

  edit(note: NoteWithFetchedTags) {
    this.store.dispatch(noteActions.openUpdateNoteFormModal({ note }));
  }

  share(note: NoteWithFetchedTags) {
    this.store.dispatch(noteActions.openShareNoteFormModal({ note }));
  }

  delete(note: NoteWithFetchedTags) {
    this.store.dispatch(noteActions.openDeleteConfirmModal({ note }));
  }

  toggleSidenav() {
    this.store.dispatch(sidenavActions.toggleSidenav());
  }

  openCreateNoteModal() {
    this.store.dispatch(noteActions.openCreateNoteFormModal());
  }
}
