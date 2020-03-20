import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-current-note-header',
  templateUrl: './current-note-header.component.html',
  styleUrls: ['./current-note-header.component.scss'],
})
export class CurrentNoteHeaderComponent implements OnInit {
  @Input() sidenavVisible: boolean;
  @Output() toggleSidenav = new EventEmitter<void>();

  iconArrowLeft = faAngleDoubleLeft;
  iconArrowRight = faAngleDoubleRight;
  iconPlus = faPlus;

  constructor(private modalService: BsModalService) {}

  ngOnInit() {}

  toggle() {
    this.toggleSidenav.emit();
  }
}
