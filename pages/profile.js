import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useUser from 'src/utils/useUser';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, loggedOut, mutate } = useUser();

  // if logged out, redirect to the homepage
  useEffect(() => {
    if (!(user || loading)) {
      router.push('/login');
    }
  }, [user, loading, router]);
  if (!(user || loading)) return 'redirecting...';

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main>
        {loading ? (
          'loading...'
        ) : (
          <>
            <h1>Welcome,{user.username}</h1>
            <p>This is your profile page.</p>
            <ul>
              <li>{user.email}</li>
              <li>{user.createdAt}</li>
            </ul>
          </>
        )}
      </main>
    </>
  );
}
