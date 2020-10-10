import useSWR from 'swr';

import fetcher from './fetcher';

export default function useUser() {
  const { data, mutate, error } = useSWR('/api/users/profile', fetcher);

  const loading = !data && !error;
  const loggedOut = error && error.status === 401;

  return {
    loading,
    loggedOut,
    user: data?.data,
    mutate,
  };
}
