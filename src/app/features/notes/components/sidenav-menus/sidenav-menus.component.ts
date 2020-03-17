import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuIcons } from '../../models/menu-icons';
import { SidenavMenus } from '../../state/sidenav';

@Component({
  selector: 'app-sidenav-menus',
  templateUrl: './sidenav-menus.component.html',
  styleUrls: ['./sidenav-menus.component.scss'],
})
export class SidenavMenusComponent implements OnInit {
  @Input() menus: MenuIcons[];
  @Input() selectedMenu: SidenavMenus;
  @Input() expandIcons: boolean;
  @Output() selectMenu = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  select(menu: string) {
    this.selectMenu.emit(menu);
  }
}
