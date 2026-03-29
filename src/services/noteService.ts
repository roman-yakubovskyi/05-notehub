import axios from 'axios';
import type { Note, NoteFormValues } from '../types/note';

const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;
const myAuthorization = 'Bearer ' + myKey;

const BASE_URL = 'https://notehub-public.goit.study/api/notes';

interface GetNotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

type DeleteNotesHttpResponse = Note;
type PostNotesHttpResponse = Note;

export async function fetchNotes(
  nameSearch: string,
  pageCurrent: number = 1
): Promise<GetNotesHttpResponse> {
  const url = BASE_URL;

  const params: Record<string, string | number> = {
    page: pageCurrent,
    perPage: 12,
  };

  if (nameSearch.trim() !== '') {
    params.search = nameSearch;
  }

  const response = await axios.get<GetNotesHttpResponse>(url, {
    headers: {
      Authorization: myAuthorization,
    },
    params,
  });

  return {
    notes: response.data.notes,
    totalPages: response.data.totalPages,
  };
}

export async function deleteNote(
  noteId: string
): Promise<DeleteNotesHttpResponse> {
  const url = `${BASE_URL}/${noteId}`;

  const response = await axios.delete<DeleteNotesHttpResponse>(url, {
    headers: {
      Authorization: myAuthorization,
    },
  });

  return response.data;
}

export async function createNote(
  noteCreate: NoteFormValues
): Promise<PostNotesHttpResponse> {
  const url = BASE_URL;

  const response = await axios.post<PostNotesHttpResponse>(url, noteCreate, {
    headers: {
      Authorization: myAuthorization,
    },
  });

  return response.data;
}
