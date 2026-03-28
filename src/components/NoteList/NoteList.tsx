import css from './NoteList.module.css';
import { type Note } from '../../types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteNote } from '../../services/noteService';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutationDeleteNote = useMutation({
    mutationFn: async (noteId: string) => {
      const deletedNote = await deleteNote(noteId);
      return deletedNote;
    },

    onSuccess: data => {
      toast.success(`Deleted note: ${data.title}`);

      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
    },

    onError: (error: Error) => {
      toast.error(`Delete ERROR: ${error.message}`);
    },
  });

  const handleDelete = (id: string) => {
    mutationDeleteNote.mutate(id);
  };

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>

            <button
              className={css.button}
              onClick={() => handleDelete(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
