import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Note } from '../../types/note';
import { faStar } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
})
export class NotesListComponent implements OnInit {
  @Input() notes: Note[];
  @Input() selectedNoteId: string | null;
  @Output() selectNote = new EventEmitter<string>();

  favoriteIcon = faStar;

  constructor() {}

  ngOnInit() {}

  select(id) {
    this.selectNote.emit(id);
  }
}
