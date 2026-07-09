import type { Request, Response } from 'express';
import type { Consulta } from '../prisma/generated/prisma/client';
import { consultaService, ConsultaService } from '../services/ConsultaService';
import { transformConsultaResponse } from '../utils/dataMappers';

class ConsultaController {
	constructor(private readonly service: ConsultaService) {}

	async listarTodasConsultas(req: Request, res: Response) {
		try {
			const pagina = req.query.pagina ? Number(req.query.pagina) : undefined;
			const limite = req.query.limite ? Number(req.query.limite) : undefined;
			const pacienteId = req.query.patientId
				? Number(req.query.patientId)
				: req.query.pacienteId
					? Number(req.query.pacienteId)
					: undefined;

			const consultas = await this.service.listarTodasConsultas(
				pagina,
				limite,
				pacienteId,
			);

			if (Array.isArray(consultas)) {
				return res.status(200).json(consultas.map(transformConsultaResponse));
			}

			return res.status(200).json({
				...consultas,
				consultas: consultas.consultas.map(transformConsultaResponse),
			});
		} catch (error) {
			console.log(error);
			return res.status(404).json({ error });
		}
	}

	async criarConsulta(req: Request, res: Response) {
		try {
			const dadosConsulta = req.body as Consulta;
			const consultaCriada = await this.service.criarConsulta(dadosConsulta);
			return res.status(201).json(transformConsultaResponse(consultaCriada));
		} catch (error) {
			console.log(error);
			return res.status(404).json({ error });
		}
	}

	async buscarConsultaId(req: Request, res: Response) {
		try {
			const idConsulta = Number(req.params.id);
			const consulta = await this.service.buscarConsultaPorId(idConsulta);

			if (!consulta) {
				return res.status(404).json({ error: 'Consulta não encontrada' });
			}

			return res.status(200).json(transformConsultaResponse(consulta));
		} catch (error) {
			console.log(error);
			return res.status(404).json({ error });
		}
	}

	async atualizarConsulta(req: Request, res: Response) {
		try {
			const idConsulta = Number(req.params.id);
			const dadosParaAtualizar = req.body as Record<string, unknown>;
			const consultaAtualizada = await this.service.atualizarConsulta(
				idConsulta,
				dadosParaAtualizar,
			);
			return res
				.status(200)
				.json(transformConsultaResponse(consultaAtualizada));
		} catch (error) {
			console.log(error);
			return res.status(404).json({ error });
		}
	}

	async deletarConsulta(req: Request, res: Response) {
		try {
			const idConsulta = Number(req.params.id);
			await this.service.deletarConsulta(idConsulta);
			return res
				.status(200)
				.json({ message: 'Consulta deletada com sucesso!' });
		} catch (error) {
			console.log(error);
			return res.status(404).json({ error });
		}
	}
}

export const consultaController = new ConsultaController(consultaService);
