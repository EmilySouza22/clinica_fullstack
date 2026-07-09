import type { Paciente } from '../prisma/generated/prisma/client';
import {
	pacienteRepository,
	type PacienteRepository,
} from '../repositories/PacienteRepository';
import { mapPacientePayloadToDbPartial } from '../utils/dataMappers';

type PacientePayload = Partial<Paciente> & Record<string, unknown>;
export class PacienteService {
	constructor(private readonly repository: PacienteRepository) {}

	async listarTodosPacientes(pagina?: number, limite?: number) {
		return await this.repository.listarTodosPacientes(pagina, limite);
	}

	async criarPaciente(dadosPaciente: PacientePayload) {
		const payload = dadosPaciente as PacientePayload;
		const nome =
			typeof payload.nome === 'string'
				? payload.nome
				: typeof payload.fullName === 'string'
					? payload.fullName
					: '';

		const cpf = typeof payload.cpf === 'string' ? payload.cpf : '';
		const telefone =
			typeof payload.telefone === 'string'
				? payload.telefone
				: typeof payload.phone === 'string'
					? payload.phone
					: '';
		const email = typeof payload.email === 'string' ? payload.email : '';
		const dataNascimento = payload.data_nascimento ?? payload.birthdate;
		const sexo =
			typeof payload.sexo === 'string'
				? payload.sexo
				: typeof payload.gender === 'string'
					? payload.gender
					: '';
		const responsavel =
			typeof payload.responsavel === 'string'
				? payload.responsavel
				: typeof payload.emergencyContact === 'string'
					? payload.emergencyContact
					: typeof payload.healthInsurance === 'string'
						? payload.healthInsurance
						: null;
		return await this.repository.criarPaciente({
			nome,
			cpf,
			telefone,
			email,
			data_nascimento: dataNascimento
				? new Date(dataNascimento as string | Date)
				: new Date(),
			sexo,
			responsavel,
		});
	}

	async buscarPacientePorId(idPaciente: number) {
		return await this.repository.buscarPacientePorId(idPaciente);
	}

	async atualizarPaciente(
		idPaciente: number,
		dadosParaAtualizar: Record<string, unknown>,
	) {
		const dados = mapPacientePayloadToDbPartial(dadosParaAtualizar);
		return await this.repository.atualizarPaciente(idPaciente, dados);
	}

	async deletarPaciente(idPaciente: number) {
		await this.repository.deletarPaciente(idPaciente);
		return { message: 'Paciente deletado com sucesso!' };
	}
}

export const pacienteService = new PacienteService(pacienteRepository);
