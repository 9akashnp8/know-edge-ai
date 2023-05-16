import React from 'react'
import ReactDOM from 'react-dom/client'

import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Root from './routes/root.jsx';
import Home from './routes/home.jsx';
import QnA from './routes/qna.jsx';
import Flashcards from './routes/flashcards.jsx';

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

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
                path: '/qna',
                element: <QnA />
            },
            {
                path: '/flashcards',
                element: <Flashcards />
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={darkTheme}>
            <RouterProvider router={router} />
        </ThemeProvider>
    </React.StrictMode>,
)
