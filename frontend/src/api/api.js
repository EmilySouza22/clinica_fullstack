import axios from 'axios';

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

const legacyRoutes = [
	{ from: /^\/patients(\/|\?|$)/, to: '/pacientes$1' },
	{ from: /^\/consults(\/|\?|$)/, to: '/consultas$1' },
	{ from: /^\/exams(\/|\?|$)/, to: '/exames$1' },
];

const resolveUrl = (url = '') => {
	if (!url) return url;

	const normalizedUrl = url.startsWith('/') ? url : `/${url}`;

	const matchedRoute = legacyRoutes.find(({ from }) =>
		from.test(normalizedUrl),
	);

	if (!matchedRoute) return normalizedUrl;

	return normalizedUrl.replace(matchedRoute.from, matchedRoute.to);
};

apiClient.interceptors.request.use((config) => {
	const token = localStorage.getItem('accessToken');

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	config.headers.Accept = 'application/json';
	config.url = resolveUrl(config.url || '');

	return config;
});

export default apiClient;
