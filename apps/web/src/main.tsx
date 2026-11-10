import React from 'react';
import {createRoot} from 'react-dom/client';
import '../../../app/globals.css';
import AppShell from '../../../features/app/app-shell';
createRoot(document.getElementById('root')!).render(<React.StrictMode><AppShell/></React.StrictMode>);
