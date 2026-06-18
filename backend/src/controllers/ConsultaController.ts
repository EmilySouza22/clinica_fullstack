import type { Request, Response } from "express";
import type { Consulta } from "../prisma/generated/prisma/client";
import { consultaService, ConsultaService } from "../services/ConsultaService";

class ConsultaController {
    constructor(private readonly service: ConsultaService) {}

    async listarTodasConsultas(req: Request, res: Response) {
        try {
            const pagina = req.query.pagina ? Number(req.query.pagina) : undefined
            const limite = req.query.limite ? Number(req.query.limite) : undefined
            const consultas = await this.service.listarTodasConsultas(pagina, limite)
            return res.status(200).json(consultas)
        } catch (error) {
            console.log(error)
            return res.status(404).json({ error })
        }
    }

    async criarConsulta(req: Request, res: Response) {
        try {
            const dadosConsulta = req.body as Consulta
            const consultaCriada = await this.service.criarConsulta(dadosConsulta)
            return res.status(201).json(consultaCriada)
        } catch (error) {
            console.log(error)
            return res.status(404).json({ error })
        }
    }

    async buscarConsultaId(req: Request, res: Response) {
        try {
            const idConsulta = Number(req.params.id)
            const consulta = await this.service.buscarConsultaPorId(idConsulta)
            return res.status(200).json(consulta)
        } catch (error) {
            console.log(error)
            return res.status(404).json({ error })
        }
    }

    async atualizarConsulta(req: Request, res: Response) {
        try {
            const idConsulta = Number(req.params.id)
            const dadosParaAtualizar = req.body as Omit<Consulta, 'id'>
            const consultaAtualizada = await this.service.atualizarConsulta(idConsulta, dadosParaAtualizar)
            return res.status(200).json(consultaAtualizada)
        } catch (error) {
            console.log(error)
            return res.status(404).json({ error })
        }
    }

    async deletarConsulta(req: Request, res: Response) {
        try {
            const idConsulta = Number(req.params.id)
            await this.service.deletarConsulta(idConsulta)
            return res.status(200).json({ message: "Consulta deletada com sucesso!" })
        } catch (error) {
            console.log(error)
            return res.status(404).json({ error })
        }
    }
}

export const consultaController = new ConsultaController(consultaService)