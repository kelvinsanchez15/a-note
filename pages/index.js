import { useState } from 'react';
import Head from 'next/head';
import Notes from 'src/components/Notes';
import useNotes from 'src/utils/useNotes';
import {
  Container,
  TextField,
  IconButton,
  InputAdornment,
} from '@material-ui/core';
import { Send as SendIcon, Create as CreateIcon } from '@material-ui/icons';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const { notes, mutate } = useNotes();
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
    mutate((cacheData) => {
      return {
        ...cacheData,
        data: [clientNote, ...cacheData.data],
      };
    }, false);
    setNewNote('');

    // Save changes to the server
    try {
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
      mutate((cacheData) => {
        return {
          ...cacheData,
          data: cacheData.data.map((note) =>
            note._id === clientNote._id ? json.data : note
          ),
        };
      }, false);
    } catch (error) {
      // Append error to failed note
      mutate((cacheData) => {
        return {
          ...cacheData,
          data: cacheData.data.map((note) =>
            note._id === clientNote._id
              ? { ...note, errorMsg: error.message }
              : note
          ),
        };
      }, false);
    }
  };

  return (
    <div>
      <Head>
        <title>A-note | A simple note-taking app</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container maxWidth="sm">
          <form onSubmit={handleSubmit}>
            <TextField
              id="description"
              name="description"
              label="Description"
              placeholder="Enter a new note"
              autoComplete="off"
              variant="outlined"
              color="primary"
              margin="normal"
              fullWidth
              value={newNote}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreateIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      type="submit"
                      aria-label="submit note"
                      color="primary"
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </form>
          <Notes notes={notes} mutate={mutate} />
        </Container>
      </main>
    </div>
  );
}
