import { useState, useEffect } from 'react';
import apiClient from '../../../api/api';
import { FaCalendarCheck } from 'react-icons/fa';

const ConsultsCounter = () => {
	const [consultCounter, setConsultCounter] = useState(0);

	useEffect(() => {
		const fetchConsults = async () => {
			try {
				const response = await apiClient.get('/consults');
				setConsultCounter(response.data.length);
			} catch (error) {
				console.error('Erro ao obter dados do pacientes', error);
			}
		};
		fetchConsults();
	}, []);

	return (
		<div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center w-60">
			<h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">
				<FaCalendarCheck className="text-blue-600" />
				{consultCounter}
			</h2>
			<p className="text-gray-600 dark:text-gray-400 mt-2">Consultas</p>
		</div>
	);
};

export default ConsultsCounter;
