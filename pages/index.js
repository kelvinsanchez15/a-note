import Head from 'next/head';
import useNotes from 'src/utils/useNotes';
import { Container, List, ListItem, ListItemText } from '@material-ui/core';

export default function Home() {
  const { notes } = useNotes();

  return (
    <div>
      <Head>
        <title>A-note | A simple note-taking app</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container>
          <h1>Notes</h1>
          <List>
            {notes?.map((note) => {
              return (
                <ListItem key={note._id}>
                  <ListItemText
                    primary={note.title}
                    secondary={note.description}
                  />
                </ListItem>
              );
            })}
          </List>
        </Container>
      </main>
    </div>
  );
}
