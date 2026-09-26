import { useEffect } from 'react';
import AppRouter from './routes/AppRouter';
import useUserStore from './context/useUserStore';
import useAdminStore from './dashboard/stores/useAdminStore';

function App() {
  useEffect(() => {
    useUserStore.getState().initialize();
    useAdminStore.getState().initialize();
  }, []);

  return <AppRouter />;
}

export default App;
