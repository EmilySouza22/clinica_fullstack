import type { Exame } from '../prisma/generated/prisma/client';
import {
	examRepository,
	type ExamRepository,
} from '../repositories/ExamRepository';
import {
	mapExamPayloadToDb,
	mapExamPayloadToDbPartial,
} from '../utils/dataMappers';

type ExamPayload = Partial<Exame> & Record<string, unknown>;

export class ExamService {
	constructor(private readonly repository: ExamRepository) {}

	async listarTodosExames(
		pagina?: number,
		limite?: number,
		pacienteId?: number,
	) {
		return await this.repository.listarTodosExames(pagina, limite, pacienteId);
	}

	async criarExame(dadosExame: ExamPayload) {
		const exame = mapExamPayloadToDb(dadosExame);
		return await this.repository.criarExame(exame);
	}

	async buscarExameId(idExame: number) {
		return await this.repository.buscarExameId(idExame);
	}

	async atualizarExame(
		idExame: number,
		dadosParaAtualizar: Record<string, unknown>,
	) {
		const exame = mapExamPayloadToDbPartial(dadosParaAtualizar);
		return await this.repository.atualizarExame(
			idExame,
			exame as Omit<Exame, 'id'>,
		);
	}

	async deletarExame(idExame: number) {
		return await this.repository.deletarExame(idExame);
	}
}

export const examService = new ExamService(examRepository);
