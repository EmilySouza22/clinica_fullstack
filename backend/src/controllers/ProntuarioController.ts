import type { Request, Response } from "express";
import type { Prontuario } from "../prisma/generated/prisma/client"
import { prontuarioService, ProntuarioService } from "../services/ProntuarioService";


class ProntuarioController {
    constructor(private readonly service: ProntuarioService) {
    }

    async listarTodosProntuarios(req: Request, res: Response) {
        try {
            const pagina = req.query.pagina ? Number(req.query.pagina) : undefined
            const limite = req.query.limite ? Number(req.query.limite) : undefined

            const prontuarios = await this.service.listarTodosProntuarios(pagina, limite);
            return res.status(200).json(prontuarios)
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async criarProntuario(req: Request, res: Response) {
        try {
            const dadosProntuario = req.body as Prontuario
            const prontuarioCriado = await this.service.criarProntuario(dadosProntuario)
            return res.status(201).json(prontuarioCriado)
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async buscarProntuarioId(req: Request, res: Response) {
        try {
            const idProntuario = Number(req.params.id)
            const prontuario = await this.service.buscarProntuarioPorId(idProntuario)
            return res.status(200).json(prontuario)
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async atualizarProntuario(req: Request, res: Response) {
        try {
            const idProntuario = Number(req.params.id)
            const dadosParaAtualizar = req.body as Omit<Prontuario, 'id'>
            const prontuarioAtualizado = await this.service.atualizarProntuario(idProntuario, dadosParaAtualizar)
            return res.status(200).json(prontuarioAtualizado);
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }


    async deletarProntuario(req: Request, res: Response) {
        try {
            const idProntuario = Number(req.params.id)
            const prontuario = await this.service.deletarProntuario(idProntuario)
            return res.status(200).json({
                message: "Prontuário foi deletado com sucesso!",
            });
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }
}
export const prontuarioController = new ProntuarioController(prontuarioService)