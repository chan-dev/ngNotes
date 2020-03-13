import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenav-search',
  templateUrl: './sidenav-search.component.html',
  styleUrls: ['./sidenav-search.component.scss'],
})
export class SidenavSearchComponent implements OnInit {
  @Output() filter = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  search(filter) {
    this.filter.emit(filter);
  }
}
