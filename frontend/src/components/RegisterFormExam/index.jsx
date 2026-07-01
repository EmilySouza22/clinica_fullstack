import React, { useState } from 'react';
import apiClient from '../../api/api';
import { toast } from 'react-toastify';

function RegisterFormExam() {
	const [formData, setFormData] = useState({
		name: '',
		date: '',
		time: '',
		type: '',
		laboratory: '',
		documentUrl: '',
		results: '',
	});

	const [isSaving, setIsSaving] = useState(false);

	// handles

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// submit form

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSaving(true);

		try {
			await apiClient.post('/exames', formData);

			toast.success('Exame cadastrado com sucesso!', {
				autoClose: 2000,
				hideProgressBar: true,
			});

			setFormData({
				name: '',
				date: '',
				time: '',
				type: '',
				laboratory: '',
				documentUrl: '',
				results: '',
			});
		} catch (error) {
			console.error(error);
			toast.error('Erro ao salvar os dados!', {
				autoClose: 2000,
				hideProgressBar: true,
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-6 text-gray-800"
			autoComplete="off"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Nome do Exame */}
				<fieldset>
					<label htmlFor="name" className="block text-sm font-medium mb-1">
						Nome do Exame
					</label>
					<input
						type="text"
						name="name"
						id="name"
						value={formData.name}
						onChange={handleInputChange}
						required
						className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
					/>
				</fieldset>

				{/* Tipo do Exame */}
				<fieldset>
					<label htmlFor="type" className="block text-sm font-medium mb-1">
						Tipo do Exame
					</label>
					<input
						type="text"
						name="type"
						id="type"
						value={formData.type}
						onChange={handleInputChange}
						required
						className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
					/>
				</fieldset>

				{/* Data */}
				<fieldset>
					<label htmlFor="date" className="block text-sm font-medium mb-1">
						Data
					</label>
					<input
						type="date"
						name="date"
						id="date"
						value={formData.date}
						onChange={handleInputChange}
						required
						className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
					/>
				</fieldset>

				{/* Horário */}
				<fieldset>
					<label htmlFor="time" className="block text-sm font-medium mb-1">
						Horário
					</label>
					<input
						type="time"
						name="time"
						id="time"
						value={formData.time}
						onChange={handleInputChange}
						required
						className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
					/>
				</fieldset>

				{/* Laboratório */}
				<fieldset>
					<label
						htmlFor="laboratory"
						className="block text-sm font-medium mb-1"
					>
						Laboratório
					</label>
					<input
						type="text"
						name="laboratory"
						id="laboratory"
						value={formData.laboratory}
						onChange={handleInputChange}
						required
						className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
					/>
				</fieldset>

				{/* URL do Documento */}
				<fieldset>
					<label
						htmlFor="documentUrl"
						className="block text-sm font-medium mb-1"
					>
						URL do Documento
					</label>
					<input
						type="url"
						name="documentUrl"
						id="documentUrl"
						value={formData.documentUrl}
						onChange={handleInputChange}
						placeholder="https://"
						className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
					/>
				</fieldset>

				{/* Resultados - ocupa largura total */}
				<fieldset className="md:col-span-2">
					<label htmlFor="results" className="block text-sm font-medium mb-1">
						Resultados
					</label>
					<textarea
						name="results"
						id="results"
						value={formData.results}
						onChange={handleInputChange}
						rows={4}
						className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none resize-none"
					/>
				</fieldset>
			</div>
		</form>
	);
}

export default RegisterFormExam;
