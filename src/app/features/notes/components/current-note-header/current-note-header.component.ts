import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import * as fromSidenav from '@app/features/notes/state/sidenav/sidenav.actions';

@Component({
  selector: 'app-current-note-header',
  templateUrl: './current-note-header.component.html',
  styleUrls: ['./current-note-header.component.scss'],
})
export class CurrentNoteHeaderComponent implements OnInit {
  @Input() title: string;
  logo = faBars;

  constructor(private store: Store<any>) {}

  ngOnInit() {}

  toggleSidenav() {
    this.store.dispatch(fromSidenav.toggleSidenav());
  }
}
