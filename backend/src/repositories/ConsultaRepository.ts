import type { Consulta } from '../prisma/generated/prisma/client';
import { prisma } from '../prisma/prisma';

export class ConsultaRepository {
	async listarTodasConsultas(
		pagina?: number,
		limite?: number,
		pacienteId?: number,
	) {
		const where = pacienteId ? { paciente_id: pacienteId } : {};
		const existePaginacao = pagina! && limite!;

		if (!existePaginacao) return await prisma.consulta.findMany({ where });

		const consultas = await prisma.consulta.findMany({
			where,
			skip: (pagina - 1) * limite,
			take: limite,
		});

		const total = await prisma.consulta.count({ where });
		const totalPaginas = Math.ceil(total / limite);

		return { consultas, total, totalPaginas };
	}

	async criarConsulta(dadosConsulta: Omit<Consulta, 'id'>) {
		return await prisma.consulta.create({
			data: {
				paciente_id: dadosConsulta.paciente_id,
				medico_responsavel_id: dadosConsulta.medico_responsavel_id,
				motivo: dadosConsulta.motivo,
				observacoes: dadosConsulta.observacoes,
				data_consulta: dadosConsulta.data_consulta,
			},
		});
	}

	async buscarConsultaPorId(idConsulta: number) {
		return await prisma.consulta.findUnique({
			where: { id: idConsulta },
			include: { paciente: true },
		});
	}

	async atualizarConsulta(
		idConsulta: number,
		dadosParaAtualizar: Partial<Omit<Consulta, 'id'>>,
	) {
		return await prisma.consulta.update({
			where: { id: idConsulta },
			data: dadosParaAtualizar,
		});
	}

	async deletarConsulta(idConsulta: number) {
		return await prisma.consulta.delete({ where: { id: idConsulta } });
	}
}

export const consultaRepository = new ConsultaRepository();
