import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  faStar,
  faStickyNote,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons';
import { Note } from '../../models/note';
import { getAllNotes, getSelectedNoteId } from '../../state';
import * as noteActions from '@app/features/notes/state/notes/notes.actions';
import { MenuIcons } from '../../models/menu-icons';

@Component({
  selector: 'app-sidenav-container',
  templateUrl: './sidenav-container.component.html',
  styleUrls: ['./sidenav-container.component.scss'],
})
export class SidenavContainerComponent {
  menuIcons: MenuIcons[] = [
    {
      menu: SidenavMenus.Notes,
      icon: faStickyNote,
    },
    {
      menu: SidenavMenus.Favorites,
      icon: faStar,
    },
    {
      menu: SidenavMenus.Trash,
      icon: faTrashAlt,
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
