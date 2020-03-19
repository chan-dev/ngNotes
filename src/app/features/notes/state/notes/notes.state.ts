import { Note, Tag } from '../../models/note';

export interface NotesState {
  items: Note[];
  sharedItems: Note[];
  tags: Tag[];
  loading: boolean;
  error: string | null;
  selectedNoteId: string | null;
}
