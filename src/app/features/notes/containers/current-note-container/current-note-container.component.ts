import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as sidenavActions from '@app/features/notes/state/sidenav/sidenav.actions';
import * as noteActions from '@app/features/notes/state/notes/notes.actions';
import { getSidenavIsVisible } from '../../state/sidenav/sidenav.selectors';

import { Note } from '../../types/note';
import {
  getSelectedNote,
  getSelectedNoteWithTags,
} from '../../state/notes/notes.selectors';

@Component({
  selector: 'app-current-note-container',
  templateUrl: './current-note-container.component.html',
  styleUrls: ['./current-note-container.component.scss'],
})
export class CurrentNoteContainerComponent implements OnInit {
  selectedNoteTitle$: Observable<string>;
  selectedNote$: Observable<Note>;
  sidenavVisible$: Observable<boolean>;

  constructor(private store: Store<any>) {
    this.selectedNote$ = this.store.select(getSelectedNoteWithTags);
    this.sidenavVisible$ = this.store.select(getSidenavIsVisible);
  }

  ngOnInit() {}

  edit(note: Note) {
    this.store.dispatch(noteActions.openUpdateNoteFormModal({ note }));
  }
  share(id) {}
  delete(id) {
    this.store.dispatch(noteActions.openDeleteConfirmModal({ id }));
  }

  toggleSidenav() {
    this.store.dispatch(sidenavActions.toggleSidenav());
  }

  openCreateNoteModal() {
    this.store.dispatch(noteActions.openCreateNoteFormModal());
  }
}
