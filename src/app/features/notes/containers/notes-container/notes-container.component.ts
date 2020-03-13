import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

import {
  getSidenavIsVisible,
  getSelectedNote,
} from '@app/features/notes/state';
import { Note } from '../../models/note';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-notes',
  templateUrl: './notes-container.component.html',
  styleUrls: ['./notes-container.component.scss'],
})
export class NotesContainerComponent implements OnInit {
  faCoffee = faCoffee;
  isVisible$: Observable<boolean>;
  notes$: Observable<Note[]>;

  constructor(private store: Store<any>) {
    this.isVisible$ = this.store.select(getSidenavIsVisible);
  }

  ngOnInit() {}
}
