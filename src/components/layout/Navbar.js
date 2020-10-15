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
  const { user, mutate } = useUser();
  const handleLogout = async () => {
    await fetch('/api/users/logout', {
      method: 'POST',
    });
    mutate(null);
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
              <IconButton edge="end" href="/profile">
                <Avatar alt="Kelvin" src={user.profileImg} />
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
