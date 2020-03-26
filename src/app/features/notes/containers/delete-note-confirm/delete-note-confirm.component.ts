import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Store } from '@ngrx/store';

import * as noteActions from '@app/features/notes/state/notes/notes.actions';
import { NoteWithFetchedTags } from '../../types/note';

@Component({
  selector: 'app-delete-note-confirm',
  templateUrl: './delete-note-confirm.component.html',
  styleUrls: ['./delete-note-confirm.component.scss'],
})
export class DeleteNoteConfirmComponent implements OnInit {
  note: NoteWithFetchedTags;
  confirmed: boolean;
  constructor(private bsModalRef: BsModalRef, private store: Store<any>) {}

  ngOnInit() {}

  hideModal() {
    this.bsModalRef.hide();
  }

  confirm() {
    this.confirmed = true;
    this.store.dispatch(noteActions.softDeleteNote({ note: this.note }));
    this.hideModal();
  }
  decline() {
    this.confirmed = false;
    this.hideModal();
  }
}
