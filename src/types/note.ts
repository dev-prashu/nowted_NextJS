export interface Note {
  id: string;
  folderId: string;
  title: string;
  isFavorite?: boolean;
  isArchived?: boolean;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  content?: string;
  preview?: string;
  folder: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
  };
}
