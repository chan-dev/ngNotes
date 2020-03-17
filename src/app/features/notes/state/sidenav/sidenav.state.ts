export enum SidenavMenus {
  Notes = 'Notes',
  Favorites = 'Favorites',
  Trash = 'Trash',
  Shared = 'Shared',
}

export interface SidenavState {
  isVisible: boolean;
  selectedMenu: SidenavMenus;
  filter: string;
}
