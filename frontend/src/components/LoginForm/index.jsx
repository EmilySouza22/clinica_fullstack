import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import { useNavigate } from 'react-router';

// Contexto
import { useAuth } from '../../contexts/useAuth';

// Modal
import Modal from '../Modal';
import RegisterUser from '../RegisterUser';

// apiClient
import apiClient from '../../api/api';

const LoginForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const navigate = useNavigate();

	const { login, user } = useAuth();

	// controle do modal

	const [isModalOpen, setIsModalOpen] = useState(false);

	// autenticação do usuário (verificação)

	useEffect(() => {
		if (user) {
			navigate('/dashboard');
		}
	}, [user, navigate]);

	//validação de login
	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			const response = await apiClient.post('/login', {
				email,
				senha: password,
			});

			const accessToken = response?.data?.accessToken;
			const refreshToken = response?.data?.refreshToken;

			if (!accessToken) {
				toast.error('Usuário não encontrado. Verifique o email e senha', {
					autoClose: 3000,
					hideProgressBar: true,
				});
				return;
			}

			localStorage.setItem('accessToken', accessToken);
			localStorage.setItem('refreshToken', refreshToken);

			login(email, accessToken);

			toast.success('Login realizado com sucesso!', {
				autoClose: 2000,
			});

			setTimeout(() => navigate('/dashboard'), 1000);
		} catch (error) {
			console.error('Erro ao verificar usuário', error);
			toast.error('Erro ao conectar com o servidor', {
				autoClose: 3000,
			});
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
			<h2 className="text-2xl font-bold text-center mb-6">Login</h2>

			<form onSubmit={handleLogin} className="space-y-4">
				<fieldset>
					<label htmlFor="email" className="block text-sm font-medium mb-1">
						Email
					</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</fieldset>

				<fieldset>
					<label htmlFor="password" className="block text-sm font-medium mb-1">
						Senha:
					</label>
					<input
						type="password"
						id="password"
						minLength={8}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</fieldset>

				<button
					type="submit"
					className="w-full bg-cyan-700 text-white p-2 rounded-lg hover:bg-cyan-800 transition-colors"
				>
					Entrar
				</button>
			</form>

			<div className="flex justify-between mt-4 text-sm">
				<button
					onClick={() => toast.info('Funcionalidade em desenvolvimento')}
					className="text-blue-600 hover:underline cursor-pointer"
				>
					Esqueceu sua senha?
				</button>

				<button
					onClick={() => setIsModalOpen(true)}
					className="text-blue-600 hover:underline cursor-pointer"
				>
					Criar Conta
				</button>
			</div>

			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<RegisterUser />
			</Modal>
		</div>
	);
};

export default LoginForm;
