import React from 'react'
import ReactDOM from 'react-dom/client'

import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import Root from './routes/root.jsx';
import Home from './routes/home.jsx';
import QnA from './routes/qna.jsx';
import Flashcards from './routes/flashcards.jsx';

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
        <RouterProvider router={router} />
    </React.StrictMode>,
)
