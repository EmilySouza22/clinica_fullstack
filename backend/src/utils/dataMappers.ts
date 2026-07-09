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
	const address = (payload.address ?? {}) as UnknownPayload;

	if (typeof payload.nome === 'string') result.nome = payload.nome;
	else if (typeof payload.fullName === 'string') result.nome = payload.fullName;

	if (typeof payload.cpf === 'string') result.cpf = payload.cpf;
	if (typeof payload.rg === 'string') result.rg = payload.rg;

	if (typeof payload.telefone === 'string') result.telefone = payload.telefone;
	else if (typeof payload.phone === 'string') result.telefone = payload.phone;

	if (typeof payload.email === 'string') result.email = payload.email;

	const dataNascimento = payload.data_nascimento ?? payload.birthdate;
	if (dataNascimento) {
		result.data_nascimento = new Date(dataNascimento as string | Date);
	}

	if (typeof payload.sexo === 'string') result.sexo = payload.sexo;
	else if (typeof payload.gender === 'string') result.sexo = payload.gender;

	if (typeof payload.estado_civil === 'string')
		result.estado_civil = payload.estado_civil;
	else if (typeof payload.maritalStatus === 'string')
		result.estado_civil = payload.maritalStatus;

	if (typeof payload.naturalidade === 'string')
		result.naturalidade = payload.naturalidade;
	else if (typeof payload.birthplace === 'string')
		result.naturalidade = payload.birthplace;

	if (typeof payload.responsavel === 'string')
		result.responsavel = payload.responsavel;
	else if (typeof payload.emergencyContact === 'string')
		result.responsavel = payload.emergencyContact;

	if (typeof payload.alergias === 'string') result.alergias = payload.alergias;
	else if (typeof payload.allergies === 'string')
		result.alergias = payload.allergies;

	if (typeof payload.cuidados_especiais === 'string')
		result.cuidados_especiais = payload.cuidados_especiais;
	else if (typeof payload.specialCare === 'string')
		result.cuidados_especiais = payload.specialCare;

	if (typeof payload.convenio === 'string') result.convenio = payload.convenio;
	else if (typeof payload.healthInsurance === 'string')
		result.convenio = payload.healthInsurance;

	if (typeof payload.numero_carteira === 'string')
		result.numero_carteira = payload.numero_carteira;
	else if (typeof payload.insuranceNumber === 'string')
		result.numero_carteira = payload.insuranceNumber;

	const validadeCarteira =
		payload.validade_carteira ?? payload.insuranceValidity;
	if (validadeCarteira) {
		result.validade_carteira = new Date(validadeCarteira as string);
	}

	if (typeof address.cep === 'string') result.cep = address.cep;
	if (typeof address.city === 'string') result.cidade = address.city;
	if (typeof address.state === 'string') result.estado = address.state;
	if (typeof address.street === 'string') result.logradouro = address.street;
	if (typeof address.number === 'string') result.numero = address.number;
	if (typeof address.complement === 'string')
		result.complemento = address.complement;
	if (typeof address.neighborhood === 'string')
		result.bairro = address.neighborhood;
	if (typeof address.reference === 'string')
		result.referencia = address.reference;

	return result;
};

export const transformPacienteResponse = (paciente: Partial<Paciente>) => ({
	...paciente,
	fullName: paciente.nome ?? '',
	cpf: paciente.cpf ?? '',
	rg: paciente.rg ?? '',
	phone: paciente.telefone ?? '',
	email: paciente.email ?? '',
	birthdate:
		paciente.data_nascimento instanceof Date
			? paciente.data_nascimento.toISOString().split('T')[0]
			: (paciente.data_nascimento ?? null),
	gender: paciente.sexo ?? '',
	emergencyContact: paciente.responsavel ?? '',
	allergies: paciente.alergias ?? '',
	maritalStatus: paciente.estado_civil ?? '',
	birthplace: paciente.naturalidade ?? '',
	specialCare: paciente.cuidados_especiais ?? '',
	healthInsurance: paciente.convenio ?? '',
	insuranceNumber: paciente.numero_carteira ?? '',
	insuranceValidity:
		paciente.validade_carteira instanceof Date
			? paciente.validade_carteira.toISOString().split('T')[0]
			: (paciente.validade_carteira ?? ''),
	address: {
		cep: paciente.cep ?? '',
		city: paciente.cidade ?? '',
		state: paciente.estado ?? '',
		street: paciente.logradouro ?? '',
		number: paciente.numero ?? '',
		complement: paciente.complemento ?? '',
		neighborhood: paciente.bairro ?? '',
		reference: paciente.referencia ?? '',
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

	if (typeof payload.type === 'string') result.tipo_exame = payload.type;
	else if (typeof payload.tipo_exame === 'string')
		result.tipo_exame = payload.tipo_exame;

	if (payload.valor !== undefined) {
		result.valor = new Prisma.Decimal(Number(payload.valor));
	}

	if (typeof payload.name === 'string') result.descricao = payload.name;
	else if (typeof payload.descricao === 'string')
		result.descricao = payload.descricao;

	const dateSource = payload.date ?? payload.data_exame ?? payload.dateTime;
	if (dateSource) {
		result.data_exame = toDate(dateSource, payload.time);
	}

	if (typeof payload.results === 'string') result.resultado = payload.results;
	else if (typeof payload.resultado === 'string')
		result.resultado = payload.resultado;

	if (payload.pacienteId !== undefined && payload.pacienteId !== null) {
		result.pacienteId = Number(payload.pacienteId);
	}

	return result;
};
