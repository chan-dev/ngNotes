import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  faStar,
  faStickyNote,
  faTrashAlt,
  faShareSquare,
} from '@fortawesome/free-regular-svg-icons';

import { Note, NoteWithFetchedTags } from '../../types/note';
import { MenuIcons } from '../../types/menu-icons';
import { SidenavMenus } from '../../state/sidenav/sidenav.state';
import {
  getFilteredNotes,
  getSelectedNoteId,
  getFilteredNotesWithTags,
} from '../../state/notes/notes.selectors';
import {
  getSidenavSelectedMenu,
  getSidenavExpandIcons,
} from '../../state/sidenav/sidenav.selectors';
import * as noteActions from '@app/features/notes/state/notes/notes.actions';
import * as sidenavActions from '@app/features/notes/state/sidenav/sidenav.actions';
import * as authActions from '@core/state/auth/auth.actions';
import { User } from '@app/features/auth/types/user';
import { getUserLoggedIn } from '@core/state/auth/auth.selectors';
import { tap } from 'rxjs/operators';

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
      menu: SidenavMenus.Shared,
      icon: faShareSquare,
    },
    // TODO: pending feature
    // {
    //   menu: SidenavMenus.Favorites,
    //   icon: faStar,
    // },
    // {
    //   menu: SidenavMenus.Trash,
    //   icon: faTrashAlt,
    // },
  ];

  notes$: Observable<NoteWithFetchedTags[]>;
  selectedNoteId$: Observable<string | null>;
  selectedMenu$: Observable<SidenavMenus>;
  expandIcons$: Observable<boolean>;
  user$: Observable<User>;

  // TODO: adjust
  scrollbarOptions = {
    scrollbarMaxSize: 250,
  };

  constructor(private store: Store<any>) {
    this.notes$ = this.store.select(getFilteredNotesWithTags);
    this.selectedNoteId$ = this.store.select(getSelectedNoteId);
    this.selectedMenu$ = this.store.select(getSidenavSelectedMenu);
    this.expandIcons$ = this.store.select(getSidenavExpandIcons);
    this.user$ = this.store.select(getUserLoggedIn);
  }

  setSelectedNote(id: string) {
    this.store.dispatch(noteActions.selectNote({ id }));
  }

  setSelectedMenu(menu: string) {
    const selectedMenuAction = this.getSelectedAction(menu);
    this.store.dispatch(selectedMenuAction());
  }

  setFilter(filter: string) {
    this.store.dispatch(sidenavActions.setSearchFilter({ filter }));
  }

  getSelectedAction(menu) {
    switch (menu) {
      case SidenavMenus.Favorites: {
        return sidenavActions.selectFavoritesMenu;
      }

      case SidenavMenus.Trash: {
        return sidenavActions.selectTrashMenu;
      }

      case SidenavMenus.Notes: {
        return sidenavActions.selectNotesMenu;
      }

      default: {
        return sidenavActions.selectSharedMenu;
      }
    }
  }

  logout() {
    this.store.dispatch(authActions.logout());
  }
}
