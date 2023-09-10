import React from 'react'
import ReactDOM from 'react-dom/client'

import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

import Root from './features/core/routes/root.jsx';
import Home from './features/core/routes/home.jsx';
import Chat from './features/chat/routes/chat.jsx';
import Flashcards from './features/flashcards/routes/flashcards.jsx';
import Documents from './features/document/routes/documents.jsx';
import { theme } from './features/core/theme.js';

import './main.css'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/chat',
                element: <Chat />
            },
            {
                path: '/flashcards',
                element: <Flashcards />
            },
            {
                path: '/documents',
                element: <Documents />
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
        </ThemeProvider>
    </React.StrictMode>,
)
