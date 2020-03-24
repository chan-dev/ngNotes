import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { User } from '../types/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$: Observable<User>;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const result = await this.afAuth.auth.signInWithPopup(provider);

    return this.updateUserData(result.user);
  }

  async signOut() {
    await this.afAuth.auth.signOut();
  }

  getAuthState(): Observable<User> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db.doc(`/users/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    );
  }
  private updateUserData(user: User): User {
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
    // Sets user data to firestore on login
    this.db.doc(`users/${user.uid}`).set(data, { merge: true });

    return data;
  }
}
