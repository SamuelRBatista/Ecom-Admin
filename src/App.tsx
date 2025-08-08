import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './presentation/routes';
import { ContextProvider } from './shared/contexts/ContextProvider';

function App() {
  return (
    <BrowserRouter>
     <ContextProvider>
        <AppRoutes />
     </ContextProvider>
     
    </BrowserRouter>
  );
}

export default App;
