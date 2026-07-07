import { useState } from 'react';
import apiClient from '../../api/api';
import { toast } from 'react-toastify';

const INPUT_CLASSES =
	'w-full border border-gray-600 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none';

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

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSaving(true);

		try {
			await apiClient.post('/exams', formData);

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
			className="space-y-6 text-gray-800 dark:text-gray-100"
			autoComplete="off"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
						className={INPUT_CLASSES}
					/>
				</fieldset>

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
						className={INPUT_CLASSES}
					/>
				</fieldset>

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
						className={INPUT_CLASSES}
					/>
				</fieldset>

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
						className={INPUT_CLASSES}
					/>
				</fieldset>

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
						className={INPUT_CLASSES}
					/>
				</fieldset>

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
						className={INPUT_CLASSES}
					/>
				</fieldset>

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
						className={`${INPUT_CLASSES} resize-none`}
					/>
				</fieldset>

				<button
					type="submit"
					disabled={isSaving}
					className={`w-full p-2 rounded-lg text-white ${
						isSaving
							? 'bg-gray-400 cursor-not-allowed'
							: 'bg-cyan-600 hover:bg-cyan-700'
					} transition-colors`}
				>
					{isSaving ? 'Salvando ...' : 'Cadastrar Exame'}
				</button>
			</div>
		</form>
	);
}

export default RegisterFormExam;
