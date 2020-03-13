import { Component, OnInit, Input } from '@angular/core';
import { MenuIcons } from '../../models/menu-icons';

@Component({
  selector: 'app-sidenav-menus',
  templateUrl: './sidenav-menus.component.html',
  styleUrls: ['./sidenav-menus.component.scss'],
})
export class SidenavMenusComponent implements OnInit {
  @Input() menus: MenuIcons[];
  constructor() {}

  ngOnInit(): void {}
}
