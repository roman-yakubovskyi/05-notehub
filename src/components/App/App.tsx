import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import css from './App.module.css';
import SearchBox from '../SearchBox/SearchBox';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import { fetchNotes, deleteNote } from '../../services/noteService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

export default function App() {
  const [query, setQuery] = useState<string>(() => {
    const savedQuery = localStorage.getItem('query');
    return savedQuery ? JSON.parse(savedQuery) : '';
  });
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const {
    data: dataNotes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['notes', query, page],
    queryFn: async () => {
      const { notes, totalPages } = await fetchNotes(query, page);
      setTotalPages(totalPages);
      return notes;
    },
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      toast.success('Delete success!');
      queryClient.invalidateQueries({
        queryKey: ['notes', query, page],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (dataNotes && dataNotes.length === 0) {
      toast.error('No notes found for your request');
    }
  }, [dataNotes]);

  const handleSearch = useDebouncedCallback((text: string) => {
    setPage(1);
    setQuery(text);
  }, 1000);

  useEffect(() => {
    localStorage.setItem('query', JSON.stringify(query));
  }, [query]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChangeText={handleSearch} />

        {totalPages > 1 && (
          <Pagination totalPages={totalPages} setPage={setPage} page={page} />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {dataNotes && dataNotes.length > 0 && (
        <NoteList
          notes={dataNotes}
          onDelete={id => deleteMutation.mutate(id)}
        />
      )}

      <Toaster />
      {isError && <ErrorMessage />}
      {isLoading && <Loader />}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} currentQuery={query} />
        </Modal>
      )}
    </div>
  );
}
