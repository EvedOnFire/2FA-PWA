import App from '@/App';
import { About, Codes, CodeForm, codeFormLoader } from '@/pages';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Codes /> },
            { path: 'new', element: <CodeForm />, loader: codeFormLoader },
            { path: 'edit/:id', element: <CodeForm />, loader: codeFormLoader },
            { path: 'about', element: <About /> },
        ]
    }
]);
