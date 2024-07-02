import { createTheme } from '@mui/material/styles';

export const themeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#536dfe',
    },
    secondary: {
      main: '#f50057',
    },
  },
};

export const theme = createTheme(themeOptions)
