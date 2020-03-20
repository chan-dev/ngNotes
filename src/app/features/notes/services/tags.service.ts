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
  private userId = 'rxBjk2snBo67SYtlQE1Z';

  constructor(private db: AngularFirestore) {}

  getTags(): Observable<Tag[]> {
    return this.db
      .collection(this.collectionName, ref =>
        ref.where('authorId', '==', this.userId)
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
}
