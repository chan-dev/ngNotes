export interface Note {
  id: string;
  title: string;
  content: string;
  favorite: boolean;
  deleted: boolean;
  // TODO: add later
  date?: string;
  authorId?: string;
}
