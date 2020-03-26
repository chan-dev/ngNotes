import { User } from '@app/features/auth/types/user';
import { ValidatorFn, AbstractControl } from '@angular/forms';

export function MustBeRegisteredUser(users: User[]): ValidatorFn {
  return (control: AbstractControl) => {
    // skip check, if there's no value
    if (!control.dirty) {
      return;
    }

    // if there are any errors already on this control,
    // then skip this check
    if (control.errors && !control.errors.mustBeRegisteredUser) {
      return;
    }

    const selectedUser: User = control.value;
    const isFound = users.find(user => user.email === selectedUser.email);
    return isFound
      ? null
      : {
          mustBeRegisteredUser: true,
        };
  };
}
