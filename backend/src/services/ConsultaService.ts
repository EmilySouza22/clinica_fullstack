import type { Consulta } from '../prisma/generated/prisma/client';
import {
	consultaRepository,
	type ConsultaRepository,
} from '../repositories/ConsultaRepository';
import {
	mapConsultaPayloadToDb,
	mapConsultaPayloadToDbPartial,
} from '../utils/dataMappers';

type ConsultaPayload = Partial<Consulta> & Record<string, unknown>;

export class ConsultaService {
	constructor(private readonly repository: ConsultaRepository) {}

	async listarTodasConsultas(
		pagina?: number,
		limite?: number,
		pacienteId?: number,
	) {
		return await this.repository.listarTodasConsultas(
			pagina,
			limite,
			pacienteId,
		);
	}

	async criarConsulta(dadosConsulta: ConsultaPayload) {
		const consulta = mapConsultaPayloadToDb(dadosConsulta);
		return await this.repository.criarConsulta(consulta);
	}

	async buscarConsultaPorId(idConsulta: number) {
		return await this.repository.buscarConsultaPorId(idConsulta);
	}

	async atualizarConsulta(
		idConsulta: number,
		dadosParaAtualizar: Record<string, unknown>,
	) {
		const consulta = mapConsultaPayloadToDbPartial(dadosParaAtualizar);
		return await this.repository.atualizarConsulta(idConsulta, consulta);
	}

	async deletarConsulta(idConsulta: number) {
		await this.repository.deletarConsulta(idConsulta);
		return { message: 'Consulta deletada com sucesso!' };
	}
}

export const consultaService = new ConsultaService(consultaRepository);
