import { Note } from '../../models/note';

export interface NotesState {
  items: Note[];
  loading: boolean;
  error: string | null;
  selectedNoteId: string | null;
}
