import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {  Routes, Route, HashRouter } from 'react-router-dom'
import Auth from './Auth.tsx'
import Dashboard from './Dashboard.tsx'
import { UserProvider } from './UserContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
    <HashRouter> 
        <Routes> 
          <Route path="/" element={<App />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </HashRouter>
    </UserProvider>
  </StrictMode>
  
)
