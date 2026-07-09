import type { Request, Response } from 'express';
import type { Exame } from '../prisma/generated/prisma/client';
import { examService, ExamService } from '../services/ExamService';
import { transformExamResponse } from '../utils/dataMappers';

class ExamController {
	constructor(private readonly service: ExamService) {}

	async listarTodosExames(req: Request, res: Response) {
		try {
			const pagina = req.query.pagina ? Number(req.query.pagina) : undefined;
			const limite = req.query.limite ? Number(req.query.limite) : undefined;
			const pacienteId = req.query.patientId
				? Number(req.query.patientId)
				: req.query.pacienteId
					? Number(req.query.pacienteId)
					: undefined;

			const exames = await this.service.listarTodosExames(
				pagina,
				limite,
				pacienteId,
			);

			if (Array.isArray(exames)) {
				return res.status(200).json(exames.map(transformExamResponse));
			}

			return res.status(200).json({
				...exames,
				exames: exames.exames.map(transformExamResponse),
			});
		} catch (error) {
			console.log(error);
			return res.status(404).json({ error });
		}
	}

	async criarExame(req: Request, res: Response) {
		try {
			const dadosExame = req.body as Record<string, unknown>;
			const exameCriado = await this.service.criarExame(dadosExame);
			return res.status(201).json(transformExamResponse(exameCriado));
		} catch (error) {
			console.log(error);
			return res.status(404).json({ error });
		}
	}

	async buscarExameId(req: Request, res: Response) {
		try {
			const idExame = Number(req.params.id);
			const exame = await this.service.buscarExameId(idExame);
			return res.status(200).json(exame);
		} catch (error) {
			console.log(error);
			return res.status(404).json({ error });
		}
	}

	async atualizarExame(req: Request, res: Response) {
		try {
			const idExame = Number(req.params.id);
			const dadosParaAtualizar = req.body as Record<string, unknown>;
			const exameAtualizado = await this.service.atualizarExame(
				idExame,
				dadosParaAtualizar,
			);
			return res.status(200).json(transformExamResponse(exameAtualizado));
		} catch (error) {
			console.log(error);
			return res.status(404).json({ error });
		}
	}

	async deletarExame(req: Request, res: Response) {
		try {
			const idExame = Number(req.params.id);
			const exame = await this.service.deletarExame(idExame);
			return res.status(200).json({
				mensagem: 'Exame deletado com sucesso!',
				data: exame,
			});
		} catch (error) {
			console.log(error);
			return res.status(404).json({ error });
		}
	}
}
export const examController = new ExamController(examService);
