import { Navigate } from 'react-router';
import { useAuth } from '../../contexts/useAuth';

const PrivateRoute = ({ children }) => {
	const { user } = useAuth();
	const hasToken = Boolean(
		user?.accessToken || localStorage.getItem('accessToken'),
	);

	if (!hasToken) {
		return <Navigate to="/" replace />;
	}

	return children;
};

export default PrivateRoute;
