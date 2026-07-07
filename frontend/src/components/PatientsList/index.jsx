import { useState, useEffect } from 'react';
import apiClient from '../../api/api';
import { FaUserAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const PatientsList = () => {
	const [patients, setPatients] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [ages, setAges] = useState({});

	const [filterInsurance, setFilterInsurance] = useState('');
	const [filterAllergy, setFilterAllergy] = useState('');

	const insuranceOptions = [
		...new Set(patients.map((p) => p.healthInsurance).filter(Boolean)),
	];

	const calculateAge = (birthdate) => {
		if (!birthdate) return '-';
		const today = new Date();
		const birthdateDate = new Date(birthdate);
		let age = today.getFullYear() - birthdateDate.getFullYear();
		const monthDiff = today.getMonth() - birthdateDate.getMonth();
		if (
			monthDiff < 0 ||
			(monthDiff === 0 && today.getDate() < birthdateDate.getDate())
		) {
			age--;
		}
		return age;
	};

	const filteredPatients = patients.filter((patient) => {
		const matchesSearch = [patient.fullName, patient.email, patient.phone]
			.join(' ')
			.toLowerCase()
			.includes(searchTerm.toLowerCase());

		const matchesInsurance = filterInsurance
			? patient.healthInsurance === filterInsurance
			: true;

		const matchesAllergy = filterAllergy
			? patient.allergies?.toLowerCase().includes(filterAllergy.toLowerCase())
			: true;

		return matchesSearch && matchesInsurance && matchesAllergy;
	});

	useEffect(() => {
		const fetchPatients = async () => {
			try {
				const response = await apiClient.get('/patients');

				const patientsData = response.data;

				// calcula a idade de cada paciente e armazena no estado

				const calculatedAges = {};
				patientsData.forEach((patient) => {
					calculatedAges[patient.id] = calculateAge(patient.birthdate);
				});
				setAges(calculatedAges);
				setPatients(patientsData);
			} catch (error) {
				console.error('Erro ao obter os dados de paciente', error);
			}
		};
		fetchPatients();
	}, []);

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	return (
		<div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 mt-8">
			<h2 className="text-xl font-semibold text-cyan-800 mb-4">
				Informações Rápidas de Pacientes
			</h2>

			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
				<label
					htmlFor="search"
					className="text-gray-700 dark:text-gray-300 font-medium"
				>
					Buscar Paciente:
				</label>
				<input
					type="text"
					id="search"
					value={searchTerm}
					onChange={handleSearchChange}
					placeholder="Digite o nome, email ou telefone"
					className="border rounded-lg px-3 py-2 w-full sm:w-80 focus:ring-2 focus:ring-cyan-600 outline-none"
				/>
			</div>

			<div className="flex flex-col sm:flex-row gap-3 mb-4">
				<select
					value={filterInsurance}
					onChange={(e) => setFilterInsurance(e.target.value)}
					className="border border-gray-600 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-600 outline-none"
				>
					<option value=""> Todos os convênios </option>
					{insuranceOptions.map((insurance) => (
						<option key={insurance} value={insurance}>
							{insurance}
						</option>
					))}
				</select>

				<input
					type="text"
					value={filterAllergy}
					onChange={(e) => setFilterAllergy(e.target.value)}
					placeholder="Filtrar por alergia"
					className="border border-gray-600 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-600 outline-none"
				/>
			</div>

			{/* Lista de pacientes */}

			{filteredPatients.length > 0 ? (
				<ul className="divide-y divide-gray-200">
					{filteredPatients.map((patient) => (
						<li
							key={patient.id}
							className="flex flex-col sm:flex-row sm:items-center justify-between py-4"
						>
							<div className="flex items-center gap-4">
								<div className="bg-cyan-100 text-cyan-700 p-3 rounded-full">
									<FaUserAlt size={20} />
								</div>
								<div>
									<p className="font-semibold text-gray-800 dark:text-gray-100">
										{patient.fullName}
									</p>
									<p className="text-sm text-gray-600">{patient.email}</p>
									<p className="text-sm text-gray-600">{patient.phone}</p>
									{patient.allergies && (
										<span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full mt-1">
											⚠ Alergia: {patient.allergies}
										</span>
									)}
								</div>
							</div>

							<div className="text-sm text-gray-600 mt-2 sm:mt-0 text-right">
								<p>
									<strong>Idade:</strong>
									{ages[patient.id] || '-'} anos
								</p>
								<p>
									<strong>Plano:</strong>
									{patient.healthInsurance || '-'}
								</p>
								<Link
									to={`/paciente/${patient.id}`}
									className="text-cyan-700 font-semibold hover:underline"
								>
									Ver detalhes
								</Link>
							</div>
						</li>
					))}
				</ul>
			) : (
				<p className="text-gray-500 text-center py-6">
					Nenhum paciente encontrado
				</p>
			)}
		</div>
	);
};

export default PatientsList;
