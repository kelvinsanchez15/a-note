import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useUser from 'src/utils/useUser';
import Link from 'src/components/Link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  TextField,
  Typography,
  Button,
  Avatar,
  Grid,
  Snackbar,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import {
  LockOutlined as LockOutlinedIcon,
  Visibility,
  VisibilityOff,
} from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(1, 0, 2),
  },
}));

const initialValues = {
  username: '',
  email: '',
  password: '',
};

const validationSchema = Yup.object({
  username: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email format').required('Required'),
  password: Yup.string().required('Required'),
});

export default function LoginPage() {
  const classes = useStyles();
  const router = useRouter();
  const [error, setError] = useState(false);
  const { user, mutate } = useUser();
  const [showPassword, setShowPassword] = useState(false);

  // redirect to home if user is authenticated
  useEffect(() => {
    if (user) router.push('/');
  }, [router, user]);

  async function onSubmit(values, onSubmitProps) {
    setError(false);
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: values.username,
        email: values.email,
        password: values.password,
      }),
    });

    if (res.status === 201) {
      const userObj = await res.json();
      onSubmitProps.resetForm();
      mutate(userObj);
    } else {
      setError(true);
    }
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>

      <Container maxWidth="xs" component="main">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Sign up
          </Typography>

          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id="username"
              name="username"
              label="Username *"
              autoComplete="username"
              variant="outlined"
              {...getFieldProps('username')}
              error={errors.username && Boolean(touched.username)}
              helperText={
                touched.username && errors.username ? errors.username : ' '
              }
            />

            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email *"
              autoComplete="email"
              variant="outlined"
              {...getFieldProps('email')}
              error={errors.email && Boolean(touched.email)}
              helperText={touched.email && errors.email ? errors.email : ' '}
            />

            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password *"
              autoComplete="new-password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              {...getFieldProps('password')}
              error={errors.password && Boolean(touched.password)}
              helperText={
                touched.password && errors.password ? errors.password : ' '
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>

            <Grid container justify="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>

        <Snackbar open={error}>
          <Alert severity="error">
            Username or Email has already been used. Try again!
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
