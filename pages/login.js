import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useUser from 'src/utils/useUser';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, TextField, Typography, Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const initialValues = {
  username: '',
  password: '',
};

const validationSchema = Yup.object({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

export default function LoginPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const { user, mutate } = useUser();
  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) router.push('/profile');
  }, [router, user]);

  async function onSubmit(values, onSubmitProps) {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: values.username,
        password: values.password,
      }),
    });

    if (res.status === 200) {
      const userObj = await res.json();
      onSubmitProps.resetForm();
      mutate(userObj);
    } else {
      setErrorMsg('Incorrect username or password. Try again!');
    }
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>

      <Container maxWidth="sm">
        {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}

        <Typography component="h2" variant="h3" align="center" gutterBottom>
          Sign in
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="username"
            name="username"
            label="Username"
            autoComplete="username"
            variant="outlined"
            color="primary"
            {...getFieldProps('username')}
            error={errors.username && Boolean(touched.username)}
            helperText={
              touched.username && errors.username ? errors.username : ' '
            }
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            autoComplete="current-password"
            type="password"
            variant="outlined"
            color="primary"
            {...getFieldProps('password')}
            error={errors.password && Boolean(touched.password)}
            helperText={
              touched.password && errors.password ? errors.password : ' '
            }
          />
          <Button
            fullWidth
            type="submit"
            variant="outlined"
            color="primary"
            size="large"
          >
            Sign in
          </Button>
        </form>
      </Container>
    </>
  );
}
