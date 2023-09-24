import React from 'react'
import ReactDOM from 'react-dom/client'

import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';

import Root from './features/core/routes/root.jsx';
import Home from './features/core/routes/home.jsx';
import Chat from './features/chat/routes/chat.jsx';
import Flashcards from './features/flashcards/routes/flashcards.jsx';
import Documents from './features/document/routes/document.jsx';
import DocumentRoot from './features/document/routes/index.jsx';
import { theme } from './features/core/theme.js';
import { store } from './features/core/store.js';

import './main.css'

const router = createBrowserRouter([
    {
        id: "crumb:home",
        path: '/',
        element: <Root />,
        children: [
            {
                id: "home",
                path: "/",
                element: <Home />,
            },
            {
                id: "crumb:documents",
                path: 'document',
                element: <DocumentRoot />,
                children: [
                    {
                        id: "documentIndex",
                        index: true,
                        element: <Documents />,
                    },
                    {
                        id: "crumb:chat",
                        path: 'chat',
                        element: <Chat />,
                    },
                    {
                        id: "crumb:flashcards",
                        path: 'flashcards',
                        element: <Flashcards />,
                    },
                ]
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>,
)
