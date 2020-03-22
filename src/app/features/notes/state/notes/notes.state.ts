import { Note, Tag, NoteWithFetchedTags } from '../../types/note';

export interface NotesState {
  items: Note[];
  sharedItems: Note[];
  tags: Tag[];
  loading: boolean;
  error: string | null;
  selectedNoteId: string | null;
  // required for displaying the current note and then fetch from server
  // each corresponding tags
  selectedNote: NoteWithFetchedTags;
}
