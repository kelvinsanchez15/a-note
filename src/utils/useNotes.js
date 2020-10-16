import useSWR from 'swr';

import fetcher from './fetcher';

export default function useNotes(user) {
  const { data, mutate, error } = useSWR(
    user ? '/api/notes?sortBy=createdAt:desc' : null,
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
