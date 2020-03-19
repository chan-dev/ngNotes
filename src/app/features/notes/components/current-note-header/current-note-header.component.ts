import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import * as fromSidenav from '@app/features/notes/state/sidenav/sidenav.actions';
import { Observable } from 'rxjs';
import { getSidenavIsVisible } from '../../state';

@Component({
  selector: 'app-current-note-header',
  templateUrl: './current-note-header.component.html',
  styleUrls: ['./current-note-header.component.scss'],
})
export class CurrentNoteHeaderComponent implements OnInit {
  isVisible$: Observable<boolean>;
  iconArrowLeft = faAngleDoubleLeft;
  iconArrowRight = faAngleDoubleRight;
  iconPlus = faPlus;

  constructor(private store: Store<any>) {
    this.isVisible$ = this.store.select(getSidenavIsVisible);
  }

  ngOnInit() {}

  toggleSidenav() {
    this.store.dispatch(fromSidenav.toggleSidenav());
  }
}
