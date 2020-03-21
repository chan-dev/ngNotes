import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Store } from '@ngrx/store';

import * as noteActions from '@app/features/notes/state/notes/notes.actions';

@Component({
  selector: 'app-delete-note-confirm',
  templateUrl: './delete-note-confirm.component.html',
  styleUrls: ['./delete-note-confirm.component.scss'],
})
export class DeleteNoteConfirmComponent implements OnInit {
  id: string;
  confirmed: boolean;
  constructor(private bsModalRef: BsModalRef, private store: Store<any>) {}

  ngOnInit() {}

  hideModal() {
    this.bsModalRef.hide();
  }

  confirm() {
    this.confirmed = true;
    this.store.dispatch(noteActions.softDeleteNote({ id: this.id }));
    this.hideModal();
  }
  decline() {
    this.confirmed = false;
    this.hideModal();
  }
}
