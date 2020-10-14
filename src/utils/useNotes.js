import useSWR from 'swr';

import fetcher from './fetcher';

export default function useNotes() {
  const { data, mutate, error } = useSWR(
    '/api/notes?sortBy=createdAt:desc',
    fetcher
  );

  const loading = !data && !error;

  return {
    loading,
    error,
    notes: data,
    mutate,
  };
}
