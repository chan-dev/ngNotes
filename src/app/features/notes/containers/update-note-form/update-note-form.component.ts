import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as noteActions from '@app/features/notes/state/notes/notes.actions';
import { Note, NoteWithFetchedTags } from '../../types/note';

@Component({
  selector: 'app-update-note-form',
  templateUrl: './update-note-form.component.html',
  styleUrls: ['./update-note-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
// TODO: accessibility
// https://valor-software.com/ngx-bootstrap/#/modals#accessibility
export class UpdateNoteFormComponent implements OnInit {
  noteForm: FormGroup;
  note: NoteWithFetchedTags; // will be filled once we opened the modal
  tags: string;

  constructor(
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private store: Store<any>
  ) {
    this.noteForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: [],
    });
  }

  ngOnInit() {
    const { title, content, tags } = this.note;
    this.noteForm.setValue({
      title,
      content,
      tags: (tags && tags.map(tag => tag.name)) || [],
    });
  }

  hideModal() {
    this.bsModalRef.hide();

    // make sure to reset user input when closing the modal
    if (this.noteForm.dirty) {
      this.noteForm.reset();
    }
  }

  updateNote() {
    const { title, content, tags } = this.noteForm.value;
    if (this.noteForm.valid) {
      this.store.dispatch(
        noteActions.updateNote({
          id: this.note.id,
          note: {
            title,
            content,
            tags,
            authorId: 'rxBjk2snBo67SYtlQE1Z',
          },
        })
      );
      this.bsModalRef.hide();
    }
  }

  get controls() {
    return this.noteForm.controls;
  }

  get isTitleInvalid() {
    return this.isFieldValid('title');
  }

  get isContentInvalid() {
    return this.isFieldValid('content');
  }

  // TODO: add to a abstract class that form modal will inherit
  private isFieldValid(field) {
    const { touched, dirty, invalid } = this.controls[field];
    return (touched || dirty) && invalid;
  }
}
