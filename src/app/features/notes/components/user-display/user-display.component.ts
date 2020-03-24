import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '@app/features/auth/types/user';

@Component({
  selector: 'app-user-display',
  templateUrl: './user-display.component.html',
  styleUrls: ['./user-display.component.scss'],
})
export class UserDisplayComponent implements OnInit {
  @Input() user: User;
  @Output() logout = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {
    console.log({ user: this.user });
  }

  logoutUser() {
    this.logout.emit();
  }
}
