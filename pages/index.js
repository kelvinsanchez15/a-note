import Head from 'next/head';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Notes from 'src/components/Notes';
import useNotes from 'src/utils/useNotes';
import {
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@material-ui/core';
import { Send as SendIcon, Create as CreateIcon } from '@material-ui/icons';

const initialValues = {
  description: '',
};

const validationSchema = Yup.object({
  description: Yup.string().min(1, 'Bruh!').max(60, 'Too Long!'),
});

export default function Home() {
  const { notes, mutate } = useNotes();

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
          <Notes notes={notes} mutate={mutate} />
        </Container>
      </main>
    </div>
  );
}
