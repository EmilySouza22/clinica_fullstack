import type {
    Prontuario,
    PrismaClient,
} from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";

export class ProntuarioRepository {
    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async listarTodosProntuarios(pagina?: number, limite?: number) {
        const existePaginacao = pagina! && limite!;
        if (!existePaginacao) return await prisma.prontuario.findMany();

        const prontuarios = await prisma.prontuario.findMany({
            skip: (pagina - 1) * limite,
            take: limite,
        });

        const total = await prisma.prontuario.count();
        const totalPaginas = Math.ceil(total / limite);
        return {
            prontuarios,
            total,
            totalPaginas,
        };
    }

    async buscarProntuarioPorId(idProntuario: number) {
        const prontuario = await prisma.prontuario.findUnique({
            where: {
                id: idProntuario,
            },
        });

        return prontuario;
    }

    async criarProntuario(dadosProntuario: Partial<Prontuario>) {
        return await this.prisma.prontuario.create({
            data: {
                paciente_id: dadosProntuario.paciente_id!,
                descricao: dadosProntuario.descricao || "",
                data: dadosProntuario.data
                    ? new Date(dadosProntuario.data)
                    : new Date(),
                medico_responsavel_id: dadosProntuario.medico_responsavel_id!,
            },
        });
    }

    async atualizarProntuario(
        idProntuario: number,
        dadosParaAtualizar: Omit<Prontuario, "id">,
    ) {
        const prontuarioAtualizado = await prisma.prontuario.update({
            data: {
                ...dadosParaAtualizar,
                data: dadosParaAtualizar.data ? new Date(dadosParaAtualizar.data) : new Date(),
            },
            where: {
                id: idProntuario,
            },
        });

        return prontuarioAtualizado;
    }

    async deletarProntuario(idProntuario: number) {
        const prontuario = await prisma.prontuario.delete({
            where: {
                id: idProntuario,
            },
        });
        
        return {
            message: "Prontuário foi deletado com sucesso"
        };
    }
}

export const prontuarioRepository = new ProntuarioRepository(prisma);
