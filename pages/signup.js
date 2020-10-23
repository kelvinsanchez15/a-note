import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useUser from 'src/utils/useUser';
import Link from 'src/components/Link';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Typography,
  Button,
  Avatar,
  Grid,
  Snackbar,
  InputAdornment,
  IconButton,
  CircularProgress,
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
  submitWrapper: {
    margin: theme.spacing(1, 0, 2),
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function LoginPage() {
  const classes = useStyles();
  const router = useRouter();
  const { user, mutate } = useUser();
  const [errorAlert, setErrorAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  // redirect to home if user is authenticated
  useEffect(() => {
    if (user) router.push('/');
  }, [router, user]);

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

          <Formik
            initialValues={{ username: '', email: '', password: '' }}
            validationSchema={Yup.object({
              username: Yup.string().required('Required'),
              email: Yup.string()
                .email('Invalid email format')
                .required('Required'),
              password: Yup.string().required('Required'),
            })}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              setErrorAlert(false);
              try {
                const res = await fetch('/api/users', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    username: values.username,
                    email: values.email,
                    password: values.password,
                  }),
                });
                setSubmitting(false);
                if (!res.ok) {
                  const { error } = await res.json();
                  throw new Error(error);
                }
                const userObj = await res.json();
                resetForm();
                mutate(userObj);
              } catch (error) {
                setErrorAlert(true);
              }
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit} className={classes.form}>
                <Field
                  component={TextField}
                  fullWidth
                  variant="outlined"
                  name="username"
                  type="username"
                  label="Username"
                  autoComplete="username"
                  helperText=" "
                />

                <Field
                  component={TextField}
                  fullWidth
                  variant="outlined"
                  name="email"
                  type="email"
                  label="Email"
                  autoComplete="email"
                  helperText=" "
                />

                <Field
                  component={TextField}
                  fullWidth
                  variant="outlined"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  autoComplete="new-password"
                  helperText=" "
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

                <div className={classes.submitWrapper}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Sign Up
                  </Button>
                  {isSubmitting && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </div>

                <Grid container justify="flex-end">
                  <Grid item>
                    <Link href="/login" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </div>

        <Snackbar open={errorAlert}>
          <Alert severity="error">
            Username or Email has already been used. Try again!
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
