import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { red, pink, teal } from '@material-ui/core/colors';

// Create a theme instance.
const theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      primary: {
        main: pink[500],
      },
      secondary: {
        main: teal.A700,
      },
      error: {
        main: red.A400,
      },
    },
  })
);

export default theme;
