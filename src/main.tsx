import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { persistor, store } from './store/store.ts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ModalProvider } from './components/context/ModalContext.tsx';
import { PersistGate } from 'redux-persist/integration/react';
import Modal from 'react-modal'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_API_CLIENT_ID}>
        <ModalProvider>
          <ToastContainer />
          <App />
        </ModalProvider>
      </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
