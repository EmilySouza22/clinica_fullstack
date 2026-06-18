import type { Paciente } from "../prisma/generated/prisma/client";
import { pacienteRepository, type PacienteRepository } from "../repositories/PacienteRepository";

export class PacienteService {
    constructor(private readonly repository: PacienteRepository) {}

    async listarTodosPacientes(pagina?: number, limite?: number) {
        return await this.repository.listarTodosPacientes(pagina, limite)
    }

    async criarPaciente(dadosPaciente: Paciente) {
        return await this.repository.criarPaciente({
            nome: dadosPaciente.nome,
            cpf: dadosPaciente.cpf,
            telefone: dadosPaciente.telefone,
            email: dadosPaciente.email,
            data_nascimento: dadosPaciente.data_nascimento ? new Date(dadosPaciente.data_nascimento) : new Date(),
            sexo: dadosPaciente.sexo,
            responsavel: dadosPaciente.responsavel || null,
        })
    }

    async buscarPacientePorId(idPaciente: number) {
        return await this.repository.buscarPacientePorId(idPaciente)
    }

    async atualizarPaciente(idPaciente: number, dadosParaAtualizar: Omit<Paciente, 'id'>) {
        return await this.repository.atualizarPaciente(idPaciente, dadosParaAtualizar)
    }

    async deletarPaciente(idPaciente: number) {
        await this.repository.deletarPaciente(idPaciente)
        return { message: "Paciente deletado com sucesso!" }
    }
}

export const pacienteService = new PacienteService(pacienteRepository)