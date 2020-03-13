import { createAction } from '@ngrx/store';
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

export const toggleSidenav = createAction('[Notes Page] Toggle Sidenav');
