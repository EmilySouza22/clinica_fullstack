import type { Paciente } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";

export class PacienteRepository {
    async listarTodosPacientes(pagina?: number, limite?: number) {
        const existePaginacao = pagina! && limite!
        if (!existePaginacao) return await prisma.paciente.findMany()
        const pacientes = await prisma.paciente.findMany({
            skip: (pagina - 1) * limite,
            take: limite
        })

        const total = await prisma.paciente.count();
        const totalPaginas = Math.ceil(total / limite)
        return {
            pacientes,
            total,
            totalPaginas
        }
    }

    async criarPaciente(dadosPaciente: Omit<Paciente, 'id'>) {
        return await prisma.paciente.create({
            data: dadosPaciente
        })
    }

    async buscarPacientePorId(idPaciente: number) {
        return await prisma.paciente.findUnique({
            where: { id: idPaciente },
            include: { Prontuario: true, Consulta: true, Exame: true }
        })
    }

    async atualizarPaciente(idPaciente: number, dadosParaAtualizar: Partial<Omit<Paciente, 'id'>>) {
        return await prisma.paciente.update({
            where: { id: idPaciente },
            data: dadosParaAtualizar
        })
    }

    async deletarPaciente(idPaciente: number) {
        return await prisma.paciente.delete({
            where: { id: idPaciente }
        })
    }
}

export const pacienteRepository = new PacienteRepository()