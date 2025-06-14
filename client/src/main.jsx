import "./index.css"
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import {store} from './utils/store.js';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
