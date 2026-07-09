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
		const dados = mapPacientePayloadToDbPartial(dadosPaciente);

		return await this.repository.criarPaciente({
			nome: dados.nome ?? '',
			cpf: dados.cpf ?? '',
			telefone: dados.telefone ?? '',
			email: dados.email ?? '',
			data_nascimento: dados.data_nascimento ?? new Date(),
			sexo: dados.sexo ?? '',
			rg: dados.rg ?? null,
			estado_civil: dados.estado_civil ?? null,
			naturalidade: dados.naturalidade ?? null,
			responsavel: dados.responsavel ?? null,
			alergias: dados.alergias ?? null,
			cuidados_especiais: dados.cuidados_especiais ?? null,
			convenio: dados.convenio ?? null,
			numero_carteira: dados.numero_carteira ?? null,
			validade_carteira: dados.validade_carteira ?? null,
			cep: dados.cep ?? null,
			cidade: dados.cidade ?? null,
			estado: dados.estado ?? null,
			logradouro: dados.logradouro ?? null,
			numero: dados.numero ?? null,
			complemento: dados.complemento ?? null,
			bairro: dados.bairro ?? null,
			referencia: dados.referencia ?? null,
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
