import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useUser from 'src/utils/useUser';
import {
  Avatar,
  IconButton,
  Button,
  Badge,
  Container,
  Typography,
  TextField,
} from '@material-ui/core';
import { PhotoCamera as PhotoCameraIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
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
  const { user, loading } = useUser();

  const [previewSource, setPreviewSource] = useState('');

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
    await fetch('/api/users/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64EncodedImage }),
    });
  };

  const handleSubmitFile = (e) => {
    e.preventDefault();
    if (!previewSource) return;
    uploadImage(previewSource);
  };

  // if logged out, redirect to the homepage
  useEffect(() => {
    if (!(user || loading)) {
      router.push('/login');
    }
  }, [user, loading, router]);
  if (!(user || loading)) return 'redirecting...';

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Container maxWidth="sm">
        {loading ? (
          'loading...'
        ) : (
          <>
            <Typography variant="h4" align="center" gutterBottom>
              Profile
            </Typography>

            <form onSubmit={handleSubmitFile}>
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
                    src={previewSource || user.profileImage}
                    className={classes.avatar}
                  />
                </Badge>
              </label>
              <TextField
                fullWidth
                id="username"
                name="username"
                label="Username"
                autoComplete="username"
                color="primary"
                defaultValue={user.username}
                // {...getFieldProps('username')}
                // error={errors.username && Boolean(touched.username)}
                helperText={' '}
              />
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                autoComplete="email"
                color="primary"
                defaultValue={user.email}
                // {...getFieldProps('email')}
                // error={errors.email && Boolean(touched.email)}
                helperText={' '}
              />
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                autoComplete="current-password"
                type="password"
                color="primary"
                defaultValue={user.password}
                // {...getFieldProps('password')}
                // error={errors.password && Boolean(touched.password)}
                helperText={' '}
              />
              <Button
                fullWidth
                type="submit"
                variant="outlined"
                color="primary"
                size="large"
              >
                Save changes
              </Button>
            </form>
          </>
        )}
      </Container>
    </>
  );
}
