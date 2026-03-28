import css from './NoteList.module.css';
import { type Note } from '../../types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteNote } from '../../services/noteService';

interface NoteListProps {
  notes: Note[];
  currentQuery: string;
}

export default function NoteList({ notes, currentQuery }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutationDeleteNote = useMutation({
    mutationFn: async (noteId: string) => {
      const noteDelete = await deleteNote(noteId);
      toast.success(`Deleted note: ${noteDelete.title}`);
    },
    onSuccess: () => {
      toast.success(`Delete success !`);
      queryClient.invalidateQueries({ queryKey: ['notes', currentQuery, 1] });
    },
    onError: error => {
      toast.error(`Deleted ERROR ${error.message}`);
    },
  });

  const taskDelete = (noteId: string) => {
    mutationDeleteNote.mutate(noteId);
  };

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button className={css.button} onClick={() => taskDelete(note.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
