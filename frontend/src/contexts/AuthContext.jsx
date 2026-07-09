import { useState } from 'react';
import { AuthContext } from './useAuth';

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const savedEmail = localStorage.getItem('email');
		const savedToken = localStorage.getItem('accessToken');

		if (savedEmail || savedToken) {
			return { email: savedEmail || '', accessToken: savedToken };
		}

		return null;
	});

	const login = (email, accessToken = null) => {
		localStorage.setItem('email', email);

		if (accessToken) {
			localStorage.setItem('accessToken', accessToken);
		}

		setUser({ email, accessToken });
	};

	const logout = () => {
		localStorage.removeItem('email');
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
