import { Note } from '../../models/note';

export interface NotesState {
  items: Note[];
  sharedItems: Note[];
  loading: boolean;
  error: string | null;
  selectedNoteId: string | null;
}
