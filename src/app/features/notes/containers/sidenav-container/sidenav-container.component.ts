import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { faStar, faStickyNote } from '@fortawesome/free-regular-svg-icons';
import { Note } from '../../models/note.model';
import { getAllNotes, getSelectedNoteId } from '../../state';
import * as noteActions from '@app/features/notes/state/notes/notes.actions';

@Component({
  selector: 'app-sidenav-container',
  templateUrl: './sidenav-container.component.html',
  styleUrls: ['./sidenav-container.component.scss'],
})
export class SidenavContainerComponent {
  menuIcons = [
    {
      menu: 'Notes',
      icon: faStickyNote,
    },
    {
      menu: 'Favorites',
      icon: faStar,
    },
  ];

  notes$: Observable<Note[]>;
  selectedNoteId$: Observable<string | null>;

  constructor(private store: Store<any>) {
    this.notes$ = this.store.select(getAllNotes);
    this.selectedNoteId$ = this.store.select(getSelectedNoteId);
  }

  setSelectedNote(id) {
    this.store.dispatch(noteActions.selectNote({ id }));
  }
}
