import type { Exame, PrismaClient } from '../prisma/generated/prisma/client';
import { prisma } from '../prisma/prisma';

export class ExamRepository {
	constructor(private readonly prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async listarTodosExames(
		pagina?: number,
		limite?: number,
		pacienteId?: number,
	) {
		const where = pacienteId ? { pacienteId } : {};
		const existePaginacao = pagina! && limite!;

		if (!existePaginacao) return await this.prisma.exame.findMany({ where });

		const exames = await this.prisma.exame.findMany({
			where,
			skip: (pagina - 1) * limite,
			take: limite,
		});

		const total = await this.prisma.exame.count({ where });
		const totalPaginas = Math.ceil(total / limite);

		return { exames, total, totalPaginas };
	}

	async buscarExameId(idExame: number) {
		return await this.prisma.exame.findUnique({ where: { id: idExame } });
	}

	async criarExame(dadosExame: Partial<Exame>) {
		const dadosCriacao = {
			tipo_exame: dadosExame.tipo_exame || '',
			valor: dadosExame.valor ?? 0,
			descricao: dadosExame.descricao || '',
			data_exame: new Date(dadosExame.data_exame || ''),
			resultado: dadosExame.resultado || '',
		} as const;

		return await this.prisma.exame.create({
			data:
				dadosExame.pacienteId === null || dadosExame.pacienteId === undefined
					? dadosCriacao
					: { ...dadosCriacao, pacienteId: dadosExame.pacienteId },
		});
	}

	async atualizarExame(idExame: number, dadosParaAtualizar: Partial<Exame>) {
	const exameAtualizado = await this.prisma.exame.update({
		data: dadosParaAtualizar,
		where: {
			id: idExame,
		},
	});

	return exameAtualizado;
}

	async deletarExame(idExame: number) {
		return await this.prisma.exame.delete({ where: { id: idExame } });
	}
}

export const examRepository = new ExamRepository(prisma);
