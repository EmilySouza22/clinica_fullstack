import type {
	Exame,
	PrismaClient,
	Token,
} from '../prisma/generated/prisma/client';
import { prisma } from '../prisma/prisma';

export class ExamRepository {
	constructor(private readonly prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async listarTodosExames(pagina?: number, limite?: number) {
		const existePaginacao = pagina! && limite!;
		if (!existePaginacao) return await prisma.exame.findMany();
		const exames = await prisma.exame.findMany({
			skip: (pagina - 1) * limite,
			take: limite,
		});

		const total = await prisma.exame.count();
		const totalPaginas = Math.ceil(total / limite);
		return {
			exames,
			total,
			totalPaginas,
		};
	}

	async buscarExameId(idExame: number) {
		const exame = await prisma.exame.findUnique({
			where: {
				id: idExame,
			},
		});

		return exame;
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
					: {
							...dadosCriacao,
							pacienteId: dadosExame.pacienteId,
						},
		});
	}

	async atualizarExame(idExame: number, dadosParaAtualizar: Omit<Exame, 'id'>) {
		const exameAtualizado = await prisma.exame.update({
			data: {
				...dadosParaAtualizar,
				data_exame: new Date(dadosParaAtualizar.data_exame),
			},
			where: {
				id: idExame,
			},
		});

		return exameAtualizado;
	}

	async deletarExame(idExame: number) {
		const exame = await prisma.exame.delete({
			where: {
				id: idExame,
			},
		});
		return exame;
	}
}

export const examRepository = new ExamRepository(prisma);
