import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, mergeMap, take, toArray } from 'rxjs/operators';

import { Note } from '../models/note';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private collectionName = '/notes';

  constructor(private db: AngularFirestore) {}

  getNotes(): Observable<Note[]> {
    // TODO: replace with logged user's id
    const userId = 'Vs7QmX0Wds9op2zzxMYn';
    // const userId = 'rxBjk2snBo67SYtlQE1Z';

    return this.db
      .collection(this.collectionName, ref =>
        ref.where('authorId', '==', userId)
      )
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Note;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
  getSharedNotes(): Observable<Note[]> {
    const collection = '/shared_notes';
    // TODO: replace with logged user's id
    const userId = 'Vs7QmX0Wds9op2zzxMYn';
    return this.db
      .doc(`shared_notes/${userId}`)
      .valueChanges()
      .pipe(
        map((sharedNotes: { notes: { [id: string]: boolean } }) => {
          return Object.keys(sharedNotes.notes);
        }),
        mergeMap(noteIds =>
          // create observable from noteIds
          from(noteIds).pipe(
            mergeMap(id =>
              this.db
                .doc(`notes/${id}`)
                .valueChanges()
                .pipe(map((note: Note) => ({ id, ...note })))
            ),
            // call take to complete the observable since toArray will
            // only execute if the observable is completed
            take(noteIds.length),
            // instead of emitting each value, emit them as an array
            toArray()
          )
        )
      );
  }
}
