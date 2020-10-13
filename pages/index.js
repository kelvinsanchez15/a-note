import { useState } from 'react';
import Head from 'next/head';
import useNotes from 'src/utils/useNotes';
import {
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Checkbox,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
  Send as SendIcon,
  Create as CreateIcon,
} from '@material-ui/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const initialValues = {
  description: '',
};

const validationSchema = Yup.object({
  description: Yup.string().min(1, 'Bruh!').max(60, 'Too Long!'),
});

export default function Home() {
  const { notes, mutate } = useNotes();
  const [checked, setChecked] = useState([0]);

  const handleToggle = (value) => () => {
    // TODO
  };

  async function onSubmit(values, onSubmitProps) {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: values.description,
      }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error.message);
    }

    mutate();
    onSubmitProps.resetForm();
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <div>
      <Head>
        <title>A-note | A simple note-taking app</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container maxWidth="sm">
          <Typography component="h2" variant="h3" align="center" gutterBottom>
            Notes
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              placeholder="Enter a note"
              variant="outlined"
              color="primary"
              {...getFieldProps('description')}
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
              error={errors.description && Boolean(touched.description)}
              helperText={
                touched.description && errors.description
                  ? errors.description
                  : ' '
              }
            />
          </form>

          <List>
            {notes?.map((note) => {
              return (
                <ListItem
                  key={note._id}
                  role={undefined}
                  dense
                  button
                  onClick={handleToggle(note._id)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={note.completed}
                      disableRipple
                      tabIndex={-1}
                    />
                  </ListItemIcon>
                  <ListItemText id={note._id} primary={note.description} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Container>
      </main>
    </div>
  );
}
