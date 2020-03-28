export interface Note {
  id: string;
  title: string;
  content: string;
  favorite: boolean;
  deleted: boolean;
  tags: { [id: string]: boolean };
  schedule: number;
  created_at: number;
  updated_at: number;
  authorId: string;
}

export type NoteWithFetchedTags = Omit<Note, 'tags'> & { tags: Tag[] };

// export type NoteFormData = Pick<Note, 'title' | 'content' | 'schedule'> & {
//   tags: string[];
// };

export type NoteFormData = Partial<Note> & {
  tags: string[];
};

export interface Tag {
  id: string;
  name: string;
  authorId: string;
}
