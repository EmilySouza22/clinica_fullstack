import type { Consulta } from '../prisma/generated/prisma/client';
import {
	consultaRepository,
	type ConsultaRepository,
} from '../repositories/ConsultaRepository';
type ConsultaPayload = Partial<Consulta> & Record<string, unknown>;
export class ConsultaService {
	constructor(private readonly repository: ConsultaRepository) {}

	async listarTodasConsultas(pagina?: number, limite?: number) {
		return await this.repository.listarTodasConsultas(pagina, limite);
	}

	async criarConsulta(dadosConsulta: ConsultaPayload) {
		const payload = dadosConsulta as ConsultaPayload;
		const dataConsultaOriginal = (payload.data_consulta ??
			payload.date ??
			'') as string | Date;
		const horaConsulta =
			typeof payload.time === 'string' && payload.time
				? `T${payload.time}`
				: '';
		const dataConsulta =
			typeof dataConsultaOriginal === 'string'
				? `${dataConsultaOriginal}${horaConsulta}`
				: dataConsultaOriginal;
		return await this.repository.criarConsulta({
			paciente_id: Number(payload.paciente_id ?? payload.patientId ?? 0),
			medico_responsavel_id: Number(payload.medico_responsavel_id ?? 1),
			motivo: String(payload.motivo ?? payload.reason ?? ''),
			observacoes: String(
				payload.observacoes ?? payload.description ?? payload.reason ?? '',
			),
			data_consulta: dataConsulta ? new Date(dataConsulta) : new Date(),
		});
	}

	async buscarConsultaPorId(idConsulta: number) {
		return await this.repository.buscarConsultaPorId(idConsulta);
	}

	async atualizarConsulta(
		idConsulta: number,
		dadosParaAtualizar: Omit<Consulta, 'id'>,
	) {
		return await this.repository.atualizarConsulta(
			idConsulta,
			dadosParaAtualizar,
		);
	}

	async deletarConsulta(idConsulta: number) {
		await this.repository.deletarConsulta(idConsulta);
		return { message: 'Consulta deletada com sucesso!' };
	}
}

export const consultaService = new ConsultaService(consultaRepository);
