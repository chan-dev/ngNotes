import { DocumentChangeAction } from '@angular/fire/firestore';

export const mapSnapshotChangesCollection = <T>(
  action: DocumentChangeAction<T>[]
) => {
  return action.map(a => {
    const data = a.payload.doc.data();
    const id = a.payload.doc.id;
    return { id, ...data };
  });
};
