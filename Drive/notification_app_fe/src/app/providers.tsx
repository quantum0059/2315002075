'use client';

import {CssBaseline, ThemeProvider, createTheme, responsiveFontSizes} from '@mui/material';
import {ReactNode} from 'react';
import {NotificationProvider} from '@/context/NotificationContext';

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1565c0',
      },
      secondary: {
        main: '#8e24aa',
      },
      background: {
        default: '#f3f6fd',
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: ['Inter', 'system-ui', 'sans-serif'].join(','),
    },
  }),
);

export default function Providers({children}: {children: ReactNode}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>{children}</NotificationProvider>
    </ThemeProvider>
  );
}
