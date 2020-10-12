import useSWR from 'swr';

import fetcher from './fetcher';

export default function useNotes() {
  const { data, mutate, error } = useSWR('/api/notes', fetcher);

  const loading = !data && !error;

  return {
    loading,
    error,
    notes: data?.data,
    mutate,
  };
}
