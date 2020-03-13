export enum SidenavMenus {
  Notes = 'Notes',
  Favorites = 'Favorites',
  Trash = 'Trash',
}

export interface SidenavState {
  isVisible: boolean;
  selectedMenu: SidenavMenus;
  filter: string;
}
