import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { getSidenavIsVisible } from '../../state/sidenav/sidenav.selectors';

@Component({
  selector: 'app-notes',
  templateUrl: './notes-container.component.html',
  styleUrls: ['./notes-container.component.scss'],
})
export class NotesContainerComponent implements OnInit {
  isSidenavVisible$: Observable<boolean>;

  constructor(private store: Store<any>) {
    this.isSidenavVisible$ = this.store.select(getSidenavIsVisible);
  }

  ngOnInit() {}
}
