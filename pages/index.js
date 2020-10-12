import Head from 'next/head';
import useNotes from 'src/utils/useNotes';
import {
  Container,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Button,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const initialValues = {
  title: '',
  description: '',
};

const validationSchema = Yup.object({
  title: Yup.string().required('Required').max(60, 'Too Long!'),
  description: Yup.string().required('Required').max(250, 'Too Long!'),
});

export default function Home() {
  const { notes, mutate } = useNotes();

  async function onSubmit(values, onSubmitProps) {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: values.title,
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

  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    values,
    handleChange,
  } = formik;

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
              id="title"
              name="title"
              label="Title"
              autoComplete="title"
              variant="outlined"
              color="primary"
              {...getFieldProps('title')}
              error={errors.title && Boolean(touched.title)}
              helperText={touched.title && errors.title ? errors.title : ' '}
            />
            <TextField
              multiline
              rows={5}
              fullWidth
              id="description"
              name="description"
              label="Description"
              autoComplete="description"
              type="description"
              variant="outlined"
              color="primary"
              onChange={handleChange}
              value={values.description}
              placeholder="Feel free to include any details."
              {...getFieldProps('description')}
              error={errors.description && Boolean(touched.description)}
              helperText={
                touched.description && errors.description
                  ? errors.description
                  : ' '
              }
            />
            <Button
              fullWidth
              type="submit"
              variant="outlined"
              color="primary"
              size="large"
            >
              Post
            </Button>
          </form>

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
