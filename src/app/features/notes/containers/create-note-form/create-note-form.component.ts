import {
  Component,
  ViewEncapsulation,
  HostListener,
  ViewChild,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  BsDatepickerDirective,
  BsDatepickerConfig,
} from 'ngx-bootstrap/datepicker';

import { Tag } from '../../types/note';
import * as noteActions from '@app/features/notes/state/notes/notes.actions';

@Component({
  selector: 'app-create-note-form',
  templateUrl: './create-note-form.component.html',
  styleUrls: ['./create-note-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
// TODO: accessibility
// https://valor-software.com/ngx-bootstrap/#/modals#accessibility
export class CreateNoteFormComponent {
  noteForm: FormGroup;
  // NOTE: allTags will be filled the moment the modal is opened, through
  // initialState in bootstrap modal component
  allTags: Tag[];
  tagNames: string[];

  datepickerConfig: Partial<BsDatepickerConfig> = {
    adaptivePosition: true,
    minDate: new Date(),
  };

  @ViewChild(BsDatepickerDirective, { static: false })
  datepicker: BsDatepickerDirective;

  @HostListener('window:scroll')
  onScrollEvent() {
    this.datepicker.hide();
  }

  constructor(
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private store: Store<any>
  ) {
    this.noteForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      schedule: ['', Validators.required],
      tags: [''],
    });
  }

  hideModal() {
    this.bsModalRef.hide();

    // make sure to reset user input when closing the modal
    if (this.noteForm.dirty) {
      this.noteForm.reset();
    }
  }

  saveNote() {
    const { title, content, tags, schedule } = this.noteForm.value;
    if (this.noteForm.valid) {
      console.log({ schedule });
      this.store.dispatch(
        noteActions.createNote({
          note: {
            title,
            content,
            tags,
            // convert dates to timestamp
            schedule: +schedule,
            authorId: 'rxBjk2snBo67SYtlQE1Z',
          },
        })
      );
      this.bsModalRef.hide();
    }
  }

  search(event) {
    this.tagNames = this.allTags
      .map(tag => tag.name)
      .filter(name => name.startsWith(event.query));
  }

  addOnEnterOrTab(event: KeyboardEvent) {
    const { target: input, key } = event as any;
    const { value } = input;

    if (key === 'Enter' || key === 'Tab') {
      // make sure that we're not allowing duplicate values
      const selectedTags = this.controls.tags.value || [];
      if (value && selectedTags.indexOf(value) === -1) {
        selectedTags.push(value);
        this.controls.tags.patchValue(selectedTags);
      }
      input.value = '';
      event.preventDefault();
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

  get isScheduleInvalid() {
    return this.isFieldValid('schedule');
  }

  // TODO: add to a abstract class that form modal will inherit
  private isFieldValid(field) {
    const { touched, dirty, invalid } = this.controls[field];
    return (touched || dirty) && invalid;
  }
}
