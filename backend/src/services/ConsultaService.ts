import type { Consulta } from "../prisma/generated/prisma/client";
import { consultaRepository, type ConsultaRepository } from "../repositories/ConsultaRepository";

export class ConsultaService {
    constructor(private readonly repository: ConsultaRepository) {}

    async listarTodasConsultas(pagina?: number, limite?: number) {
        return await this.repository.listarTodasConsultas(pagina, limite)
    }

    async criarConsulta(dadosConsulta: Consulta) {
        return await this.repository.criarConsulta({
            paciente_id: dadosConsulta.paciente_id,
            medico_responsavel_id: dadosConsulta.medico_responsavel_id,
            motivo: dadosConsulta.motivo || "",
            observacoes: dadosConsulta.observacoes || "",
            data_consulta: dadosConsulta.data_consulta ? new Date(dadosConsulta.data_consulta) : new Date(),
        })
    }

    async buscarConsultaPorId(idConsulta: number) {
        return await this.repository.buscarConsultaPorId(idConsulta)
    }

    async atualizarConsulta(idConsulta: number, dadosParaAtualizar: Omit<Consulta, 'id'>) {
        return await this.repository.atualizarConsulta(idConsulta, dadosParaAtualizar)
    }

    async deletarConsulta(idConsulta: number) {
        await this.repository.deletarConsulta(idConsulta)
        return { message: "Consulta deletada com sucesso!" }
    }
}

export const consultaService = new ConsultaService(consultaRepository)