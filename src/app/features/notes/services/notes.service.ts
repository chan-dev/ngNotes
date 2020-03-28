import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, mergeMap, take, toArray, switchMap } from 'rxjs/operators';

import { Note, NoteFormData, Tag, NoteWithFetchedTags } from '../types/note';
import { Observable, from } from 'rxjs';
import difference from 'lodash-es/difference';
import { TagsService } from './tags.service';
import { mapSnapshotChangesCollection } from '@shared/helpers/firebase-helpers';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private collectionName = '/notes';

  constructor(private db: AngularFirestore, private tagsService: TagsService) {}

  getNotes(userId): Observable<Note[]> {
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
        ),
        take(1)
      );
  }

  // used to query firebase for any changes to the /notes
  // collection, then we'll use it to sync notes between users
  getNotesStateChanges() {
    return this.db
      .collection<Note>('/notes')
      .stateChanges(['modified', 'removed'])
      .pipe(map(mapSnapshotChangesCollection));
  }

  getSharedNotes(userId): Observable<Note[]> {
    return this.db
      .doc(`shared_notes/${userId}`)
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

  async saveSharedNotes(note: NoteWithFetchedTags, receiverId: string) {
    // TODO: use an id instead of a note
    // fetch the note first to get info from the note
    await this.db.doc(`/shared_notes/${receiverId}`).set(
      {
        senderId: note.authorId,
        notes: {
          [note.id]: true,
        },
      },
      { merge: true }
    );

    // TODO: remove this once all NoteWithFetchedTags are removed
    const tags = note.tags.reduce((acc, cur) => {
      acc[cur.id] = true;
      return acc;
    }, {});

    return {
      ...note,
      tags,
    };
  }

  getNoteWithTags(id: string): Observable<NoteWithFetchedTags> {
    return this.db
      .doc(`${this.collectionName}/${id}`)
      .valueChanges()
      .pipe(
        mergeMap((note: Note) => {
          const { tags, ...noteInfo } = note;
          const tagIds = Object.keys(tags);

          return from(tagIds).pipe(
            mergeMap(tagId =>
              this.tagsService
                .getTag(tagId)
                .pipe(map((tag: Tag) => ({ id: tagId, ...tag })))
            ),
            // call take to complete the observable since toArray will
            // only execute if the observable is completed
            take(tagIds.length),
            // instead of emitting each value, emit them as an array
            toArray(),
            map((noteTags: Tag[]) => ({ id, ...noteInfo, tags: noteTags }))
          );
        })
      );
  }

  getSharedNoteWithTags(userId: string, id: string) {
    return this.db
      .doc(`shared_notes/${userId}`)
      .valueChanges()
      .pipe(
        map((sharedNotes: { notes: { [id: string]: boolean } }) => {
          const sharedNoteIds = sharedNotes
            ? Object.keys(sharedNotes.notes)
            : [];
          return sharedNoteIds.find(sharedNoteId => sharedNoteId === id);
        }),
        switchMap(sharedNoteId => this.getNoteWithTags(sharedNoteId))
      );
  }

  getNotesByTags(): Observable<any> {
    const collection = '/notes';
    const tagId = '6VYCXGWUCshO8WGSNdLL';
    return this.db
      .collection(`${collection}`, ref => ref.where(`tag.${tagId}`, '>=', ''))
      .valueChanges();
  }

  /**
   * NOTE: atomic operations
   * 1. save the tags first if any
   * 2. save note and associate the created tags
   */
  async saveNote(
    userId: string,
    formData: NoteFormData,
    allTagsObjectArray: Tag[]
  ) {
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
        authorId: userId,
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

    const currentDate = Date.now();

    // create the new note and associate the tags map
    const newNoteRef = firestore.collection('/notes').doc();
    const newNoteData = {
      ...noteData,
      favorite: false,
      deleted: false,
      created_at: +currentDate,
      updated_at: +currentDate,
      tags: allNoteTagsMap,
      authorId: userId,
    };
    newNoteRef.set(newNoteData);

    return batch.commit().then(() => {
      return {
        id: newNoteRef.id,
        ...newNoteData,
      } as Note;
    });
  }

  async updateNote(
    userId: string,
    id: string,
    formData: NoteFormData,
    allTagsObjectArray: Tag[]
  ) {
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
        authorId: userId,
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
      tags: allNoteTagsMap,
      updated_at: +Date.now(),
      authorId: userId,
    };

    batch.update(currentNoteRef, currentNoteData);

    return batch.commit().then(() => {
      return {
        ...currentNoteData,
        id,
      } as Note;
    });
  }

  async softDeleteNote(note: NoteWithFetchedTags) {
    // TODO: remove this once all NoteWithFetchedTags are removed
    const tags = note.tags.reduce((acc, cur) => {
      acc[cur.id] = true;
      return acc;
    }, {});

    const updatedNote: Note = {
      ...note,
      tags,
      deleted: true,
      favorite: false,
    };
    await this.db.doc(`/notes/${note.id}`).update(updatedNote);

    return updatedNote;
  }
}
