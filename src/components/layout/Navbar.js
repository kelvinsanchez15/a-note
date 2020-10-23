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
    color: theme.palette.common.black,
  },
  navItem: {
    marginLeft: theme.spacing(2),
    color: theme.palette.common.black,
    '&:hover': {
      textDecoration: 'none',
    },
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
          <Link className={classes.title} href="/">
            <Typography variant="h6">A-Note</Typography>
          </Link>

          {!user ? (
            <>
              <Button
                className={classes.navItem}
                href="/login"
                component={Link}
              >
                Sign in
              </Button>
              <Button
                className={classes.navItem}
                href="/signup"
                variant="outlined"
                color="inherit"
                component={Link}
              >
                Sign up
              </Button>
            </>
          ) : (
            <>
              <IconButton edge="end" href="/profile" component={Link}>
                <Avatar alt="Kelvin" src={user?.profileImage || ''} />
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
