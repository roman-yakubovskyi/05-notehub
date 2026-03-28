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

  const options = {
    headers: {
      Authorization: myAuthorization,
    },
    params: {
      search: nameSearch,
      page: pageCurrent,
      perPage: 12,
    },
  };

  const response = await axios.get<GetNotesHttpResponse>(url, options);
  return {
    notes: response.data.notes,
    totalPages: response.data.totalPages,
  };
}

export async function deleteNote(
  noteId: string
): Promise<DeleteNotesHttpResponse> {
  let url = BASE_URL;
  if (noteId !== '') {
    url = url + `/${noteId}`;

    const options = {
      headers: {
        Authorization: myAuthorization,
      },
    };

    const response = await axios.delete<DeleteNotesHttpResponse>(url, options);

    return response.data;
  } else {
    throw new Error('Note ID is required for deletion');
  }
}

export async function createNote(
  noteCreate: NoteFormValues
): Promise<PostNotesHttpResponse> {
  const url = BASE_URL;

  const options = {
    headers: {
      // accept: 'application/json',
      Authorization: myAuthorization,
    },
  };

  const response = await axios.post<PostNotesHttpResponse>(
    url,
    noteCreate,
    options
  );

  return response.data;
}
