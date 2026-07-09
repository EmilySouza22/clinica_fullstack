import { Prisma } from '../prisma/generated/prisma/client';
import type {
	Consulta,
	Exame,
	Paciente,
} from '../prisma/generated/prisma/client';

type UnknownPayload = Record<string, unknown>;

const toDate = (value: unknown, time?: unknown): Date => {
	if (typeof value !== 'string' || !value) return new Date();
	const alreadyHasTime = value.includes('T');
	const timeStr =
		!alreadyHasTime && typeof time === 'string' && time ? `T${time}` : '';
	return new Date(`${value}${timeStr}`);
};

export const mapPacientePayloadToDbPartial = (
	payload: UnknownPayload,
): Partial<Omit<Paciente, 'id'>> => {
	const result: Partial<Omit<Paciente, 'id'>> = {};

	if (typeof payload.nome === 'string') result.nome = payload.nome;
	else if (typeof payload.fullName === 'string') result.nome = payload.fullName;

	if (typeof payload.cpf === 'string') result.cpf = payload.cpf;

	if (typeof payload.telefone === 'string') result.telefone = payload.telefone;
	else if (typeof payload.phone === 'string') result.telefone = payload.phone;

	if (typeof payload.email === 'string') result.email = payload.email;

	const dataNascimento = payload.data_nascimento ?? payload.birthdate;
	if (dataNascimento) {
		result.data_nascimento = new Date(dataNascimento as string | Date);
	}

	if (typeof payload.sexo === 'string') result.sexo = payload.sexo;
	else if (typeof payload.gender === 'string') result.sexo = payload.gender;

	if (typeof payload.responsavel === 'string')
		result.responsavel = payload.responsavel;
	else if (typeof payload.emergencyContact === 'string')
		result.responsavel = payload.emergencyContact;
	else if (typeof payload.healthInsurance === 'string')
		result.responsavel = payload.healthInsurance;

	return result;
};

export const transformPacienteResponse = (paciente: Partial<Paciente>) => ({
	...paciente,
	fullName: paciente.nome ?? '',
	cpf: paciente.cpf ?? '',
	phone: paciente.telefone ?? '',
	email: paciente.email ?? '',
	birthdate:
		paciente.data_nascimento instanceof Date
			? paciente.data_nascimento.toISOString().split('T')[0]
			: (paciente.data_nascimento ?? null),
	gender: paciente.sexo ?? '',
	emergencyContact: paciente.responsavel ?? '',
	healthInsurance: paciente.responsavel ?? '',
	allergies: (paciente as any).alergias ?? '',
	maritalStatus: (paciente as any).estado_civil ?? '',
	birthplace: (paciente as any).naturalidade ?? '',
	specialCare: (paciente as any).cuidados_especiais ?? '',
	insuranceNumber: (paciente as any).numero_carteira ?? '',
	insuranceValidity:
		(paciente as any).validade_carteira instanceof Date
			? (paciente as any).validade_carteira.toISOString().split('T')[0]
			: ((paciente as any).validade_carteira ?? ''),
	address: {
		cep: (paciente as any).cep ?? '',
		city: (paciente as any).cidade ?? '',
		state: (paciente as any).estado ?? '',
		street: (paciente as any).logradouro ?? '',
		number: (paciente as any).numero ?? '',
		complement: (paciente as any).complemento ?? '',
		neighborhood: (paciente as any).bairro ?? '',
		reference: (paciente as any).referencia ?? '',
	},
});

export const mapConsultaPayloadToDb = (
	payload: UnknownPayload,
): Omit<Consulta, 'id'> => {
	return {
		paciente_id: Number(payload.paciente_id ?? payload.patientId ?? 0),
		medico_responsavel_id: Number(
			payload.medico_responsavel_id ?? payload.medicoResponsavelId ?? 1,
		),
		motivo: String(payload.reason ?? payload.motivo ?? ''),
		observacoes: String(
			payload.description ?? payload.observacoes ?? payload.reason ?? '',
		),
		medicamento:
			typeof payload.medication === 'string'
				? payload.medication
				: typeof payload.medicamento === 'string'
					? payload.medicamento
					: null,
		precaucoes_dosagem:
			typeof payload.dosagePrecautions === 'string'
				? payload.dosagePrecautions
				: typeof payload.precaucoes_dosagem === 'string'
					? payload.precaucoes_dosagem
					: null,
		data_consulta: toDate(
			payload.data_consulta ?? payload.date ?? payload.dateTime,
			payload.time,
		),
	} as Omit<Consulta, 'id'>;
};

export const transformConsultaResponse = (consulta: Partial<Consulta>) => {
	const dateValue =
		consulta.data_consulta instanceof Date
			? consulta.data_consulta
			: consulta.data_consulta;
	const dateIso =
		dateValue instanceof Date ? dateValue.toISOString() : (dateValue ?? '');
	const [datePart, timePart] = (dateIso as string).split('T');

	return {
		...consulta,
		patientId: consulta.paciente_id,
		reason: consulta.motivo ?? '',
		description: consulta.observacoes ?? '',
		date: datePart ?? '',
		time: timePart ? timePart.slice(0, 5) : '',
		medication: consulta.medicamento ?? '',
		dosagePrecautions: consulta.precaucoes_dosagem ?? '',
	};
};

export const mapExamPayloadToDb = (payload: UnknownPayload): Partial<Exame> => {
	const descricao =
		typeof payload.descricao === 'string'
			? payload.descricao
			: typeof payload.name === 'string'
				? payload.name
				: '';

	const pacienteId =
		payload.pacienteId !== undefined && payload.pacienteId !== null
			? Number(payload.pacienteId)
			: undefined;

	return {
		tipo_exame: String(payload.tipo_exame ?? payload.type ?? ''),
		valor: new Prisma.Decimal(Number(payload.valor ?? 0)),
		descricao,
		data_exame: toDate(
			payload.data_exame ?? payload.date ?? payload.dateTime,
			payload.time,
		),
		resultado: String(payload.resultado ?? payload.results ?? ''),
		...(pacienteId !== undefined ? { pacienteId } : {}),
	};
};

export const transformExamResponse = (exame: Partial<Exame>) => {
	const dateValue =
		exame.data_exame instanceof Date ? exame.data_exame : exame.data_exame;
	const dateIso =
		dateValue instanceof Date ? dateValue.toISOString() : (dateValue ?? '');
	const [datePart, timePart] = (dateIso as string).split('T');

	return {
		...exame,
		name: exame.descricao ?? '',
		type: exame.tipo_exame ?? '',
		date: datePart ?? '',
		time: timePart ? timePart.slice(0, 5) : '',
		results: exame.resultado ?? '',
		laboratory: (exame as any).laboratorio ?? '',
		documentUrl: (exame as any).documento_url ?? '',
	};
};

export const mapConsultaPayloadToDbPartial = (
	payload: UnknownPayload,
): Partial<Omit<Consulta, 'id'>> => {
	const result: Partial<Omit<Consulta, 'id'>> = {};

	if (typeof payload.medicamento === 'string')
		result.medicamento = payload.medicamento;
	else if (typeof payload.medication === 'string')
		result.medicamento = payload.medication;

	if (typeof payload.precaucoes_dosagem === 'string')
		result.precaucoes_dosagem = payload.precaucoes_dosagem;
	else if (typeof payload.dosagePrecautions === 'string')
		result.precaucoes_dosagem = payload.dosagePrecautions;

	if (payload.paciente_id !== undefined || payload.patientId !== undefined) {
		result.paciente_id = Number(payload.paciente_id ?? payload.patientId);
	}

	if (
		payload.medico_responsavel_id !== undefined ||
		payload.medicoResponsavelId !== undefined
	) {
		result.medico_responsavel_id = Number(
			payload.medico_responsavel_id ?? payload.medicoResponsavelId,
		);
	}

	if (typeof payload.motivo === 'string') result.motivo = payload.motivo;
	else if (typeof payload.reason === 'string') result.motivo = payload.reason;

	if (typeof payload.observacoes === 'string')
		result.observacoes = payload.observacoes;
	else if (typeof payload.description === 'string')
		result.observacoes = payload.description;

	const dateSource = payload.data_consulta ?? payload.date ?? payload.dateTime;
	if (dateSource) {
		result.data_consulta = toDate(dateSource, payload.time);
	}

	if (typeof payload.medicamento === 'string')
		result.medicamento = payload.medicamento;
	else if (typeof payload.medication === 'string')
		result.medicamento = payload.medication;

	if (typeof payload.precaucoes_dosagem === 'string')
		result.precaucoes_dosagem = payload.precaucoes_dosagem;
	else if (typeof payload.dosagePrecautions === 'string')
		result.precaucoes_dosagem = payload.dosagePrecautions;

	if (typeof payload.reason === 'string') result.motivo = payload.reason;
	else if (typeof payload.motivo === 'string') result.motivo = payload.motivo;

	if (typeof payload.description === 'string')
		result.observacoes = payload.description;
	else if (typeof payload.observacoes === 'string')
		result.observacoes = payload.observacoes;

	if (typeof payload.medication === 'string')
		result.medicamento = payload.medication;
	else if (typeof payload.medicamento === 'string')
		result.medicamento = payload.medicamento;

	if (typeof payload.dosagePrecautions === 'string')
		result.precaucoes_dosagem = payload.dosagePrecautions;
	else if (typeof payload.precaucoes_dosagem === 'string')
		result.precaucoes_dosagem = payload.precaucoes_dosagem;

	return result;
};

export const mapExamPayloadToDbPartial = (
	payload: UnknownPayload,
): Partial<Exame> => {
	const result: Partial<Exame> = {};

	if (typeof payload.tipo_exame === 'string')
		result.tipo_exame = payload.tipo_exame;
	else if (typeof payload.type === 'string') result.tipo_exame = payload.type;

	if (payload.valor !== undefined) {
		result.valor = new Prisma.Decimal(Number(payload.valor));
	}

	if (typeof payload.descricao === 'string')
		result.descricao = payload.descricao;
	else if (typeof payload.name === 'string') result.descricao = payload.name;

	const dateSource = payload.data_exame ?? payload.date ?? payload.dateTime;
	if (dateSource) {
		result.data_exame = toDate(dateSource, payload.time);
	}

	if (typeof payload.resultado === 'string')
		result.resultado = payload.resultado;
	else if (typeof payload.results === 'string')
		result.resultado = payload.results;

	if (payload.pacienteId !== undefined && payload.pacienteId !== null) {
		result.pacienteId = Number(payload.pacienteId);
	}

	return result;
};
