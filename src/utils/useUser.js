import useSWR from 'swr';

import fetcher from './fetcher';

export default function useUser() {
  const { data, mutate, error } = useSWR('/api/users/profile', fetcher);

  const loading = !data && !error;
  const isLoggedOut = !data && error?.status === 404;

  return {
    loading,
    error: isLoggedOut ? null : error,
    user: data?.data,
    mutate,
  };
}
