import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  faStar,
  faStickyNote,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons';
import { Note } from '../../models/note';
import {
  getSelectedNoteId,
  getSidenavSelectedMenu,
  getFilteredNotes,
} from '../../state';
import * as noteActions from '@app/features/notes/state/notes/notes.actions';
import * as sidenavActions from '@app/features/notes/state/sidenav/sidenav.actions';
import { MenuIcons } from '../../models/menu-icons';
import { SidenavMenus } from '../../state/sidenav';

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
  selectedMenu$: Observable<SidenavMenus>;

  constructor(private store: Store<any>) {
    this.notes$ = this.store.select(getAllNotes);
    this.selectedNoteId$ = this.store.select(getSelectedNoteId);
    this.selectedMenu$ = this.store.select(getSidenavSelectedMenu);
  }

  setSelectedNote(id: string) {
    this.store.dispatch(noteActions.selectNote({ id }));
  }

  setSelectedMenu(menu: string) {
    const selectedMenuAction = this.getSelectedAction(menu);
    this.store.dispatch(selectedMenuAction());
    // TODO: find a way to not dispatch 2 actions
    this.store.dispatch(noteActions.selectNote({ id: null }));
  }


  getSelectedAction(menu) {
    switch (menu) {
      case SidenavMenus.Favorites: {
        return sidenavActions.selectFavoritesMenu;
      }

      case SidenavMenus.Trash: {
        return sidenavActions.selectTrashMenu;
      }

      default: {
        return sidenavActions.selectNotesMenu;
      }
    }
  }
}
