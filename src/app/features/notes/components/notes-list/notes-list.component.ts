import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Note } from '../../types/note';
import { faStar } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
})
export class NotesListComponent {
  @Input() notes: Note[];
  @Input() selectedNoteId: string | null;
  @Output() selectNote = new EventEmitter<string>();

  favoriteIcon = faStar;

  select(id) {
    this.selectNote.emit(id);
  }
}
