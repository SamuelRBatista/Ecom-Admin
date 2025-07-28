import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './presentation/routes';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
