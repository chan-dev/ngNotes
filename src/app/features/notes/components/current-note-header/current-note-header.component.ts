import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-current-note-header',
  templateUrl: './current-note-header.component.html',
  styleUrls: ['./current-note-header.component.scss'],
})
// TODO: convert to container component?
export class CurrentNoteHeaderComponent implements OnInit {
  @Input() sidenavVisible: boolean;
  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() openCreateModal = new EventEmitter<void>();

  iconArrowLeft = faAngleDoubleLeft;
  iconArrowRight = faAngleDoubleRight;
  iconPlus = faPlus;

  constructor() {}

  ngOnInit() {}

  toggle() {
    this.toggleSidenav.emit();
  }

  openModal() {
    this.openCreateModal.emit();
  }
}
