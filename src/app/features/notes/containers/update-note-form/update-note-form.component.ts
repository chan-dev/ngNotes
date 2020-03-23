import {
  Component,
  ViewEncapsulation,
  OnInit,
  ViewChild,
  HostListener,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  BsDatepickerDirective,
  BsDatepickerConfig,
} from 'ngx-bootstrap/datepicker';

import * as noteActions from '@app/features/notes/state/notes/notes.actions';
import { NoteWithFetchedTags } from '../../types/note';

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
      tags: [],
    });
  }

  ngOnInit() {
    const { title, content, tags, schedule } = this.note;
    this.noteForm.setValue({
      title,
      content,
      // date-picker requires a date value,
      schedule: new Date(schedule),
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
    const { title, content, tags, schedule } = this.noteForm.value;
    if (this.noteForm.valid) {
      this.store.dispatch(
        noteActions.updateNote({
          id: this.note.id,
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
