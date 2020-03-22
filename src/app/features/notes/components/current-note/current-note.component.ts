import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NoteWithFetchedTags } from '../../types/note';
import {
  faEdit,
  faShareSquare,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-current-note',
  templateUrl: './current-note.component.html',
  styleUrls: ['./current-note.component.scss'],
})
export class CurrentNoteComponent implements OnInit {
  @Input() note: NoteWithFetchedTags;
  @Output() edit = new EventEmitter<NoteWithFetchedTags>();
  @Output() share = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  editLogo = faEdit;
  shareLogo = faShareSquare;
  deleteLogo = faTrashAlt;

  constructor() {}

  ngOnInit() {}

  editNote() {
    this.edit.emit(this.note);
  }

  shareNote() {
    this.share.emit(this.note.id);
  }

  deleteNote() {
    this.delete.emit(this.note.id);
  }
}
