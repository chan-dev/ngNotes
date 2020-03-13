import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Note } from '../../models/note';
import { getSelectedNote } from '../../state';

@Component({
  selector: 'app-current-note-container',
  templateUrl: './current-note-container.component.html',
  styleUrls: ['./current-note-container.component.scss'],
})
export class CurrentNoteContainerComponent implements OnInit {
  selectedNoteTitle$: Observable<string>;
  selectedNote$: Observable<Note>;

  constructor(private store: Store<any>) {
    this.selectedNote$ = this.store.select(getSelectedNote);
  }

  ngOnInit() {}
}
