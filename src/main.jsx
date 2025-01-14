import '@fontsource/poppins'; // Defaults to 400 weight
import 'boxicons'; // For icons
import '@fontsource/raleway'; // Defaults to 400 weight
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.js';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
  </StrictMode>,
)
