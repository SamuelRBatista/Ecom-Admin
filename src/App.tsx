import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRoutes } from './presentation/routes';
import { ContextProvider } from './shared/contexts/ContextProvider';
import { theme } from './presentation/themes/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <ContextProvider>
          <AppRoutes />
        </ContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
