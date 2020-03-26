import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { User } from '@app/features/auth/types/user';
import { NoteWithFetchedTags, Note } from '../../types/note';
import * as noteActions from '@app/features/notes/state/notes/notes.actions';
import { MustBeRegisteredUser } from '@shared/validators/must-be-registered-user.validator';

@Component({
  selector: 'app-share-note-form',
  templateUrl: './share-note-form.component.html',
  styleUrls: ['./share-note-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShareNoteFormComponent implements OnInit {
  // These properties will be filled when the modal is opened
  users: User[];
  note: NoteWithFetchedTags;

  selectedUser: FormControl;
  allUsers: User[];

  constructor(private bsModalRef: BsModalRef, private store: Store<any>) {}

  ngOnInit() {
    // exclude the author of the note to be shared
    // this.allUsers = this.users.filter(user => user.id !== this.note.authorId);
    this.selectedUser = new FormControl('', [
      Validators.required,
      MustBeRegisteredUser(this.users),
    ]);
  }

  hideModal() {
    this.bsModalRef.hide();

    if (this.selectedUser.dirty) {
      this.selectedUser.reset();
    }
  }

  share() {
    this.store.dispatch(
      noteActions.shareNote({
        note: this.note,
        receiverId: this.selectedUser.value.uid,
      })
    );

    this.bsModalRef.hide();
  }

  filterUsers(event) {
    this.allUsers = this.users.filter(
      user =>
        user.id !== this.note.authorId && user.email.startsWith(event.query)
    );
  }

  get isEmpty() {
    const { errors } = this.selectedUser;
    return (
      errors &&
      errors.required &&
      (this.selectedUser.touched || this.selectedUser.dirty)
    );
  }

  get isNotARegisteredUser() {
    const { errors } = this.selectedUser;
    return (
      errors &&
      !errors.required &&
      errors.mustBeRegisteredUser &&
      (this.selectedUser.touched || this.selectedUser.dirty)
    );
  }
}
