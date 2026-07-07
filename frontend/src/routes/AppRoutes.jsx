import { createBrowserRouter } from 'react-router';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import PrivateRoute from '../components/PrivateRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import MedicalRecordList from '../components/MedicalRecordList';
import RegisterFormPatient from '../components/RegisterFormPatient';
import ConsultationForm from '../components/ConsultationForm';
import RegisterFormExam from '../components/RegisterFormExam';
import PatientDetails from '../components/PatientDetails';

const router = createBrowserRouter([
	{ path: '/', element: <Login /> },
	{
		element: (
			<PrivateRoute>
				<DashboardLayout />
			</PrivateRoute>
		),
		children: [
			{ path: '/dashboard', element: <Dashboard /> },
			{ path: '/prontuarios', element: <MedicalRecordList /> },
			{ path: '/pacientes', element: <RegisterFormPatient /> },
			{ path: '/consultas', element: <ConsultationForm /> },
			{ path: '/exames', element: <RegisterFormExam /> },
			{ path: '/paciente/:id', element: <PatientDetails /> },
		],
	},
]);

export default router;
