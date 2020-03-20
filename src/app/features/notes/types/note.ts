export interface Note {
  id: string;
  title: string;
  content: string;
  favorite: boolean;
  deleted: boolean;
  tags?: Tag[];
  // TODO: add later and remove optional symbol
  date?: string; // must be timestamp
  authorId?: string;
}

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
