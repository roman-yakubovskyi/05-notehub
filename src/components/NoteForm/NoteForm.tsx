import css from './NoteForm.module.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import type { FormikHelpers } from 'formik/dist/types';
import * as Yup from 'yup';
import type { NoteFormValues } from '../../types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createNote } from '../../services/noteService';

interface NoteFormProps {
  onClose: () => void;
  currentQuery: string;
}

const initialValuesForm: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

export default function NoteForm({ onClose, currentQuery }: NoteFormProps) {
  const queryClient = useQueryClient();

  const validationSchemaNoteForm = Yup.object({
    title: Yup.string()
      .min(3, 'Title must be at least 3 characters')
      .max(50, 'Title must be at most 50 characters')
      .required('Title is required'),
    content: Yup.string().max(500, 'Content must be at most 500 characters'),
    tag: Yup.string()
      .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
      .required('Tag is required'),
  });

  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>
  ) => {
    taskCreate(values);
    actions.resetForm();
  };

  const mutationCreateNote = useMutation({
    mutationFn: async (note: NoteFormValues) => {
      const noteNew = await createNote(note);
      toast.success(`Created note: ${noteNew.title}`);
    },
    onSuccess: () => {
      toast.success(`Create success !`);
      onClose();
      queryClient.invalidateQueries({ queryKey: ['notes', currentQuery, 1] });
    },
    onError: error => {
      toast.error(`Created ERROR ${error.message}`);
    },
  });

  const taskCreate = (createNote: NoteFormValues) => {
    mutationCreateNote.mutate(createNote);
  };

  return (
    <Formik
      initialValues={initialValuesForm}
      onSubmit={handleSubmit}
      validationSchema={validationSchemaNoteForm}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field
            id="title"
            type="text"
            name="title"
            className={css.input}
            // autoFocus={true}
          />
          <ErrorMessage component="span" name="title" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage component="span" name="content" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage component="span" name="tag" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </button>

          <button type="submit" className={css.submitButton} disabled={false}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
