export interface Note {
  id: string;
  title: string;
  content: string;
  favorite: boolean;
  deleted: boolean;
  tags?: { [id: string]: boolean };
  // tags: string[],
  // TODO: add later and remove optional symbol
  date?: string; // must be timestamp
  authorId?: string;
}

export type NoteWithFetchedTags = Omit<Note, 'tags'> & { tags: Tag[] };

export type NoteFormData = Pick<
  Note,
  'title' | 'content' | 'authorId' | 'date'
> & {
  tags: string[];
};

export interface Tag {
  id: string;
  name: string;
}
