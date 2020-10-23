import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Notes from 'src/components/Notes';
import useUser from 'src/utils/useUser';
import useNotes from 'src/utils/useNotes';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  TextField,
  IconButton,
  InputAdornment,
} from '@material-ui/core';
import { Send as SendIcon, Create as CreateIcon } from '@material-ui/icons';
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
  },
}));

export default function Home() {
  const classes = useStyles();
  const router = useRouter();
  const { user, isLoggedOut } = useUser();
  const { notes, loading: loadingNotes, mutate } = useNotes(user);
  const [newNote, setNewNote] = useState('');

  const handleChange = (event) => setNewNote(event.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clientNote = {
      _id: uuidv4(),
      description: newNote,
      clientOnly: true,
    };

    // Optimistic update
    mutate(
      (cacheData) => ({
        ...cacheData,
        data: [clientNote, ...cacheData.data],
      }),
      false
    );
    setNewNote('');

    try {
      // Save changes to the server
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: newNote,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error.message);
      }

      const json = await res.json();

      // Validate cache data with server response
      mutate(
        (cacheData) => ({
          ...cacheData,
          data: cacheData.data.map((note) =>
            note._id === clientNote._id ? json.data : note
          ),
        }),
        false
      );
    } catch (error) {
      // Append error to failed note
      mutate(
        (cacheData) => ({
          ...cacheData,
          data: cacheData.data.map((note) =>
            note._id === clientNote._id
              ? { ...note, errorMsg: "Couldn't save, please try again!" }
              : note
          ),
        }),
        false
      );
    }
  };

  // if logged out, redirect to the homepage
  useEffect(() => {
    if (isLoggedOut) {
      router.replace('/login');
    }
  }, [isLoggedOut, router]);

  return (
    <>
      <Head>
        <title>A-note | A simple note-taking app</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxWidth="sm" component="main">
        <div className={classes.paper}>
          <form onSubmit={handleSubmit}>
            <TextField
              id="description"
              name="description"
              label="Description"
              placeholder="Enter a new note"
              autoComplete="off"
              variant="outlined"
              color="primary"
              fullWidth
              disabled={loadingNotes}
              value={newNote}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    disablePointerEvents
                    style={{ minWidth: '50px' }}
                  >
                    <CreateIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="submit"
                      aria-label="submit note"
                      color="primary"
                      edge="end"
                      disabled={loadingNotes}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </form>
          <Notes notes={notes} mutate={mutate} loadingNotes={loadingNotes} />
        </div>
      </Container>
    </>
  );
}
