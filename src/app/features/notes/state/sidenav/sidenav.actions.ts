import { createAction, props } from '@ngrx/store';

export const toggleSidenav = createAction(
  '[CurrentNoteHeaderComponent] Toggle Sidenav'
);

// action that reacts on media query via angular cdk
export const setSidenav = createAction(
  '[Angular Cdk Api] Set Sidenav',
  props<{ isMobile: boolean }>()
);

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
