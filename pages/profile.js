import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useUser from 'src/utils/useUser';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';
import {
  Avatar,
  IconButton,
  Button,
  Badge,
  Container,
  Typography,
  Snackbar,
  CircularProgress,
  InputAdornment,
} from '@material-ui/core';
import {
  PhotoCamera as PhotoCameraIcon,
  Visibility,
  VisibilityOff,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
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
  input: {
    display: 'none',
  },
  uploadLabel: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },
  uploadIcon: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover, &.Mui-focusVisible': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

export default function ProfilePage() {
  const classes = useStyles();
  const router = useRouter();
  const { user, isLoggedOut, mutate } = useUser();

  const [errorAlert, setErrorAlert] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [messageInfo, setMessageInfo] = useState(undefined);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorAlert(false);
    setSuccessAlert(false);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [previewSource, setPreviewSource] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setPreviewSource(reader.result);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
  };

  const uploadImage = async (base64EncodedImage) => {
    setErrorAlert(false);
    setSuccessAlert(false);
    setIsUploading(true);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64EncodedImage }),
      });
      setIsUploading(false);
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
      const userObj = await res.json();
      setSuccessAlert(true);
      setMessageInfo('Avatar updated successfully!');
      mutate(userObj);
    } catch (error) {
      setIsUploading(false);
      setErrorAlert(true);
      setMessageInfo(error.message);
    }
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (!previewSource) return;
    uploadImage(previewSource);
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const handleMouseDownNewPassword = () => setShowNewPassword(!showNewPassword);

  // if logged out, redirect to the homepage
  useEffect(() => {
    if (isLoggedOut) {
      router.replace('/login');
    }
  }, [isLoggedOut, router]);

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Container maxWidth="xs" component="main">
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Profile
          </Typography>

          {/* USER AVATAR FORM */}
          <form className={classes.form} onSubmit={handleFileSubmit}>
            <label htmlFor="icon-button-file" className={classes.uploadLabel}>
              <input
                accept="image/*"
                className={classes.input}
                id="icon-button-file"
                type="file"
                onChange={handleFileInputChange}
              />
              <Badge
                overlap="circle"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                badgeContent={
                  // eslint-disable-next-line react/jsx-wrap-multilines
                  <IconButton
                    aria-label="upload picture"
                    component="span"
                    className={classes.uploadIcon}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                }
              >
                <Avatar
                  src={previewSource || user?.profileImage}
                  className={classes.avatar}
                />
              </Badge>
            </label>

            <div className={classes.submitWrapper}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={isUploading}
              >
                Upload Avatar
              </Button>
              {isUploading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </form>

          {/* USER INFO FORM */}
          <Formik
            initialValues={{
              username: user?.username ? user.username : '',
              email: user?.email ? user.email : '',
            }}
            validationSchema={Yup.object({
              username: Yup.string().required('Required'),
              email: Yup.string()
                .email('Invalid email format')
                .required('Required'),
            })}
            enableReinitialize
            onSubmit={async (values, { setSubmitting }) => {
              setErrorAlert(false);
              setSuccessAlert(false);
              try {
                const res = await fetch('/api/users/profile', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    username: values.username,
                    email: values.email,
                  }),
                });
                setSubmitting(false);
                if (!res.ok) {
                  const { error } = await res.json();
                  throw new Error(error);
                }
                const userObj = await res.json();
                setSuccessAlert(true);
                setMessageInfo('Profile updated successfully!');
                mutate(userObj);
              } catch (error) {
                setSubmitting(false);
                setErrorAlert(true);
                setMessageInfo(
                  'Username or Email has already been used. Try again!'
                );
              }
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit} className={classes.form}>
                <Field
                  component={TextField}
                  name="username"
                  type="username"
                  label="Username"
                  helperText=" "
                  fullWidth
                />
                <Field
                  component={TextField}
                  name="email"
                  type="email"
                  label="Email"
                  helperText=" "
                  fullWidth
                />

                <div className={classes.submitWrapper}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Update Information
                  </Button>
                  {isSubmitting && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </div>
              </Form>
            )}
          </Formik>

          {/* USER PASSWORD FORM */}
          <Formik
            initialValues={{
              password: '',
              newPassword: '',
            }}
            validationSchema={Yup.object({
              password: Yup.string().required('Required'),
              newPassword: Yup.string().required('Required'),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              setErrorAlert(false);
              setSuccessAlert(false);
              try {
                const res = await fetch('/api/users/profile', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    password: values.password,
                    newPassword: values.newPassword,
                  }),
                });
                setSubmitting(false);
                if (!res.ok) {
                  const { error } = await res.json();
                  throw new Error(error);
                }
                const userObj = await res.json();
                setSuccessAlert(true);
                setMessageInfo('Profile updated successfully!');
                mutate(userObj);
              } catch (error) {
                setSubmitting(false);
                setErrorAlert(true);
                setMessageInfo(error.message);
              }
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit} className={classes.form}>
                <Field
                  component={TextField}
                  variant="outlined"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Current Password"
                  autoComplete="current-password"
                  helperText=" "
                  fullWidth
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
                <Field
                  component={TextField}
                  name="newPassword"
                  variant="outlined"
                  type={showNewPassword ? 'text' : 'password'}
                  label="New Password"
                  autoComplete="new-password"
                  helperText=" "
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          edge="end"
                          onClick={handleClickShowNewPassword}
                          onMouseDown={handleMouseDownNewPassword}
                        >
                          {showNewPassword ? <Visibility /> : <VisibilityOff />}
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
                    disabled={isSubmitting}
                    type="submit"
                  >
                    Change Password
                  </Button>
                  {isSubmitting && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <Snackbar
          open={errorAlert}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error">
            {messageInfo}
          </Alert>
        </Snackbar>
        <Snackbar
          open={successAlert}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="success">
            {messageInfo}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
