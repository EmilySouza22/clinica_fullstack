import { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router';
import {
	MdDashboard,
	MdExitToApp,
	MdMenu,
	MdClose,
	MdLightMode,
	MdDarkMode,
} from 'react-icons/md';
import { FaUserPlus, FaListAlt, FaCalendarCheck } from 'react-icons/fa';
import { useAuth } from '../../contexts/useAuth';

const SideMenu = () => {
	const navigate = useNavigate();
	const { logout } = useAuth();

	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isDark, setIsDark] = useState(false);

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	const toggleMenu = () => {
		setIsCollapsed(!isCollapsed);
	};

	const toggleTheme = () => {
		setIsDark(!isDark);
	};

	useEffect(() => {
		document.documentElement.classList.toggle('dark', isDark);
	}, [isDark]);

	return (
		<aside
			className={`h-screen bg-cyan-800 dark:bg-gray-900 text-white flex flex-col justify-between transition-all duration-300 ${
				isCollapsed ? 'w-20' : 'w-64'
			}`}
		>
			<div className="p-4 flex items-center justify-between border-b border-cyan-700 dark:border-gray-700">
				{!isCollapsed && <h1 className="text-lg font-bold">Clínica +</h1>}
				<button
					onClick={toggleMenu}
					className="text-white hover:text-cyan-300 focus:outline-none"
				>
					{isCollapsed ? <MdMenu size={24} /> : <MdClose size={24} />}
				</button>
			</div>

			<nav className="flex-1 p-4 space-y-4 overflow-y-auto">
				<ul className="space-y-3">
					<li>
						<NavLink
							to="/dashboard"
							className={({ isActive }) =>
								`flex gap-2 hover:text-cyan-300 ${isActive ? 'text-cyan-300' : 'text-white'}`
							}
						>
							<MdDashboard size={20} />
							{!isCollapsed && <span>Início</span>}
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/prontuarios"
							className={({ isActive }) =>
								`flex gap-2 hover:text-cyan-300 ${isActive ? 'text-cyan-300' : 'text-white'}`
							}
						>
							<FaCalendarCheck size={20} />
							{!isCollapsed && <span>Prontuários</span>}
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/pacientes"
							className={({ isActive }) =>
								`flex gap-2 hover:text-cyan-300 ${isActive ? 'text-cyan-300' : 'text-white'}`
							}
						>
							<FaUserPlus size={20} />
							{!isCollapsed && <span>Registrar Paciente</span>}
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/consultas"
							className={({ isActive }) =>
								`flex gap-2 hover:text-cyan-300 ${isActive ? 'text-cyan-300' : 'text-white'}`
							}
						>
							<MdMenu size={20} />
							{!isCollapsed && <span>Consultas</span>}
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/exames"
							className={({ isActive }) =>
								`flex gap-2 hover:text-cyan-300 ${isActive ? 'text-cyan-300' : 'text-white'}`
							}
						>
							<FaListAlt size={20} />
							{!isCollapsed && <span>Exames</span>}
						</NavLink>
					</li>
					<li className="border-t border-cyan-700 dark:border-gray-700 pt-3 mt-3">
						<button
							onClick={toggleTheme}
							className="flex gap-2 hover:text-cyan-300 text-white w-full cursor-pointer"
						>
							{isDark ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
							{!isCollapsed && (
								<span>{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>
							)}
						</button>
					</li>
				</ul>
			</nav>
			<div className="p-4 border-t border-cyan-700 dark:border-gray-700">
				<button
					onClick={handleLogout}
					className="flex items-center gap-3 text-red-300 hover:text-red-500 w-full cursor-pointer"
				>
					<MdExitToApp size={20} />
					{!isCollapsed && <span>Sair</span>}
				</button>
			</div>
		</aside>
	);
};

export default SideMenu;
