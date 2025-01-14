import '@fontsource/poppins'; // Defaults to 400 weight
import '@fontsource/raleway'; // Defaults to 400 weight
import 'boxicons'; // For icons
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import './index.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
  </StrictMode>,
)
