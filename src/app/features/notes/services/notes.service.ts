import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, mergeMap, take, toArray } from 'rxjs/operators';

import { Note, NoteFormData, Tag } from '../models/note';
import { Observable, from, of } from 'rxjs';
import difference from 'lodash-es/difference';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private collectionName = '/notes';
  private userId = 'rxBjk2snBo67SYtlQE1Z';

  constructor(private db: AngularFirestore) {}

  getNotes(): Observable<Note[]> {
    return this.db
      .collection(this.collectionName, ref =>
        ref.where('authorId', '==', this.userId)
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
    // const userId = 'Vs7QmX0Wds9op2zzxMYn';
    return this.db
      .doc(`shared_notes/${this.userId}`)
      .valueChanges()
      .pipe(
        map((sharedNotes: { notes: { [id: string]: boolean } }) => {
          return sharedNotes ? Object.keys(sharedNotes.notes) : [];
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

  /**
   * NOTE: atomic operations
   * 1. save the tags first if any
   * 2. save note and associate the created tags
   */
  async saveNote(formData: NoteFormData, allTagsObjectArray: Tag[]) {
    const { tags: selectedTags, ...noteData } = formData;
    const firestore = this.db.firestore;

    // create a batch for atomic writes
    const batch = firestore.batch();

    const allTags = allTagsObjectArray.map(tag => tag.name);

    const newTags: string[] = difference(selectedTags, allTags);
    const existingTags: string[] = difference(selectedTags, newTags);

    const newTagsIds = newTags.map(tag => {
      const newTagRef = firestore.collection('tags').doc();
      // save all new tags
      batch.set(newTagRef, {
        name: tag,
      });
      return newTagRef.id;
    });

    const existingTagsIds = allTagsObjectArray
      .filter(tag => existingTags.includes(tag.name))
      .map(tag => tag.id);

    const allNoteTagsIds = [...newTagsIds, ...existingTagsIds];

    // required as a map of each tag reference for a Note document
    const allNoteTagsMap = allNoteTagsIds.reduce((acc, cur) => {
      acc[cur] = true;
      return acc;
    }, {});

    // create the new note and associate the tags map
    const newNoteRef = firestore.collection('/notes').doc('newNote');
    const newNoteData = {
      ...noteData,
      favorite: false,
      deleted: false,
      tags: allNoteTagsMap,
    };
    newNoteRef.set(newNoteData);

    return batch.commit().then(() => {
      return {
        id: newNoteRef.id,
        ...newNoteData,
      } as Note;
    });
  }

  async updateNote(id, formData: NoteFormData, allTagsObjectArray: Tag[]) {
    const { tags: selectedTags, ...noteData } = formData;
    const firestore = this.db.firestore;

    // create a batch for atomic writes
    const batch = firestore.batch();

    const allTags = allTagsObjectArray.map(tag => tag.name);

    const newTags: string[] = difference(selectedTags, allTags);
    const existingTags: string[] = difference(selectedTags, newTags);
    // const removedTags: string[] = difference(allTags, existingTags);

    const newTagsIds = newTags.map(tag => {
      const newTagRef = firestore.collection('tags').doc();
      // save all new tags
      batch.set(newTagRef, {
        name: tag,
      });
      return newTagRef.id;
    });

    const existingTagsIds = allTagsObjectArray
      .filter(tag => existingTags.includes(tag.name))
      .map(tag => tag.id);

    const allNoteTagsIds = [...newTagsIds, ...existingTagsIds];

    // required as a map of each tag reference for a Note document
    const allNoteTagsMap = allNoteTagsIds.reduce((acc, cur) => {
      acc[cur] = true;
      return acc;
    }, {});

    // remove associated tags to tags map in current note
    const currentNoteRef = firestore.doc(`/notes/${id}`);
    const currentNoteData = {
      ...noteData,
      favorite: false,
      deleted: false,
      tags: allNoteTagsMap,
    };

    batch.set(currentNoteRef, currentNoteData, { merge: true });

    return batch.commit().then(() => {
      return {
        ...currentNoteData,
        id,
      } as Note;
    });
  }
}
