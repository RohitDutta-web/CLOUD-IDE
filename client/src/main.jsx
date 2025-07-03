import "./index.css"
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store, persistor } from './utils/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import { Toaster } from "./components/ui/sonner.js";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Provider store={store}>
  <PersistGate  persistor={persistor}>
      <App />
      <Toaster/>
  </PersistGate>
</Provider>
);
