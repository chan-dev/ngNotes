import { createAction, props } from '@ngrx/store';

export const toggleSidenav = createAction(
  '[CurrentNoteHeaderComponent] Toggle Sidenav'
);

// TODO: replace with correct event source
export const selectNotesMenu = createAction(
  '[SidenavContainerComponent] Select Notes Menu'
);
export const selectFavoritesMenu = createAction(
  '[SidenavContainerComponent] Select Favorites Menu'
);
export const selectTrashMenu = createAction(
  '[SidenavContainerComponent] Select Trash Menu'
);
export const selectSharedMenu = createAction(
  '[SidenavContainerComponent] Select Shared Menu'
);

export const setSearchFilter = createAction(
  '[SidenavContainerComponent] Set Search Filter',
  props<{ filter: string }>()
);
