import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentChangeAction,
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { mapSnapshotChangesCollection } from '@shared/helpers/firebase-helpers';
import { User } from '@app/features/auth/types/user';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private collectionName = '/users';

  constructor(private db: AngularFirestore) {}

  getUsers(): Observable<User[]> {
    return this.db
      .collection(this.collectionName)
      .snapshotChanges()
      .pipe(
        map<DocumentChangeAction<User>[], User[]>(action =>
          mapSnapshotChangesCollection<User>(action)
        )
      );
  }
}
