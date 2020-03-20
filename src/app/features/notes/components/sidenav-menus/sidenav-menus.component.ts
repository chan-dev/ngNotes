import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MenuIcons } from '../../types/menu-icons';
import { SidenavMenus } from '../../state/sidenav';

@Component({
  selector: 'app-sidenav-menus',
  templateUrl: './sidenav-menus.component.html',
  styleUrls: ['./sidenav-menus.component.scss'],
})
export class SidenavMenusComponent {
  @Input() menus: MenuIcons[];
  @Input() selectedMenu: SidenavMenus;
  @Input() expandIcons: boolean;
  @Output() selectMenu = new EventEmitter<string>();

  select(menu: string) {
    this.selectMenu.emit(menu);
  }
}
