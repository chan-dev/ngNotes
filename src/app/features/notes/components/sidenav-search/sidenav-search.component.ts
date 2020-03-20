import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenav-search',
  templateUrl: './sidenav-search.component.html',
  styleUrls: ['./sidenav-search.component.scss'],
})
export class SidenavSearchComponent {
  @Output() filter = new EventEmitter<string>();

  search(filter) {
    this.filter.emit(filter);
  }
}
