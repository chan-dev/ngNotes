import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { Tag } from '../types/note';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  private collectionName = '/tags';

  constructor(private db: AngularFirestore) {}

  getTags(userId): Observable<Tag[]> {
    return this.db
      .collection(this.collectionName, ref =>
        ref.where('authorId', '==', userId)
      )
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Tag;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  getTag(id: string): Observable<Tag> {
    return this.db
      .doc<Tag>(`${this.collectionName}/${id}`)
      .valueChanges()
      .pipe(
        map(data => {
          return { id, ...data };
        })
      );
  }
}
