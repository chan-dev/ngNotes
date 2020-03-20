import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as noteActions from '@app/features/notes/state/notes/notes.actions';

@Component({
  selector: 'app-create-note-form',
  templateUrl: './create-note-form.component.html',
  styleUrls: ['./create-note-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
// TODO: accessibility
// https://valor-software.com/ngx-bootstrap/#/modals#accessibility
export class CreateNoteFormComponent implements OnInit {
  noteForm: FormGroup;
  tags: string[];

  constructor(
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private store: Store<any>
  ) {
    this.noteForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: [''],
    });
  }

  ngOnInit() {}

  hideModal() {
    this.bsModalRef.hide();

    // make sure to reset user input when closing the modal
    if (this.noteForm.dirty) {
      this.noteForm.reset();
    }
  }

  saveNote() {
    const { title, content, tags } = this.noteForm.value;
    if (this.noteForm.valid) {
      this.store.dispatch(
        noteActions.createNote({
          note: {
            title,
            content,
            tags,
            authorId: 'rxBjk2snBo67SYtlQE1Z',
            date: Date.now().toString(), // TODO: replace with date-fns call
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
