import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
} from '@material-ui/core';
import Link from 'src/components/Link';
import useUser from 'src/utils/useUser';
import useNotes from 'src/utils/useNotes';
import { cache } from 'swr';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  navItem: {
    marginLeft: theme.spacing(2),
  },
}));

export default function Navbar() {
  const classes = useStyles();
  const { user, mutate: mutateUser } = useUser();
  const { mutate: mutateNotes } = useNotes();

  const handleLogout = async () => {
    await fetch('/api/users/logout', {
      method: 'POST',
    });
    mutateNotes(null);
    mutateUser(null);
    cache.clear();
  };

  return (
    <nav>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Link className={classes.title} href="/" color="inherit">
            <Typography variant="h6">A-note</Typography>
          </Link>

          {!user ? (
            <>
              <Link
                className={classes.navItem}
                href="/login"
                color="inherit"
                variant="button"
              >
                Sign in
              </Link>
              <Link
                className={classes.navItem}
                href="/signup"
                color="inherit"
                variant="button"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <IconButton edge="end" href="/profile" component={Link}>
                <Avatar alt="Kelvin" src={user.profileImage} />
              </IconButton>

              <Button
                className={classes.navItem}
                onClick={handleLogout}
                variant="outlined"
                color="inherit"
              >
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </nav>
  );
}
