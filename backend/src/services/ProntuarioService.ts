import type { Prontuario } from "../prisma/generated/prisma/client";
import { prontuarioRepository, type ProntuarioRepository } from "../repositories/ProntuarioRepository";

export class ProntuarioService {
    constructor(private readonly repository: ProntuarioRepository) { // TO-DO TIPAR SERVICE
    }

    async listarTodosProntuarios(pagina?: number, limite?: number) {
        const prontuarios = await this.repository.listarTodosProntuarios(pagina, limite)
        return prontuarios
    }

    async criarProntuario(dadosProntuario: Prontuario) {
        const prontuarioCriado = await this.repository.criarProntuario({
            paciente_id: dadosProntuario.paciente_id!,
            descricao: dadosProntuario.descricao || "",
            data: dadosProntuario.data ? new Date(dadosProntuario.data) : new Date(),
            medico_responsavel_id: dadosProntuario.medico_responsavel_id!,
        })
        return prontuarioCriado
    }

    async buscarProntuarioPorId(idProntuario: number) {
        const prontuario = await this.repository.buscarProntuarioPorId(idProntuario);
        return prontuario;
    }

    async atualizarProntuario(idProntuario: number, dadosParaAtualizar: Omit<Prontuario, 'id'>) {
        const prontuarioAtualizado = await this.repository.atualizarProntuario(idProntuario, dadosParaAtualizar)
        return prontuarioAtualizado;
    }


    async deletarProntuario(idProntuario: number) {
        const prontuario = await this.repository.deletarProntuario(idProntuario);
        return {
            message: "Prontuario deletado com sucesso!"
        };
    }
}

export const prontuarioService = new ProntuarioService(prontuarioRepository)