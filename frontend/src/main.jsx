import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { RouterProvider } from 'react-router/dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import router from './routes/AppRoutes';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<AuthProvider>
			<ToastContainer />
			<RouterProvider router={router} />
		</AuthProvider>
	</StrictMode>,
);
