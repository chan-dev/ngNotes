import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
// import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

import * as authActions from '@core/state/auth/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  googleLogo = faGoogle;

  constructor(private store: Store<any>) {}

  ngOnInit() {}

  login(event) {
    event.preventDefault();
    this.store.dispatch(authActions.login());
  }
}
