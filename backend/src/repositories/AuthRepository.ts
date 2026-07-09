import type {
	PrismaClient,
	Token,
	Usuario,
} from '../prisma/generated/prisma/client';
import { prisma } from '../prisma/prisma';

export class AuthRepository {
	constructor(private readonly prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async cadastrar(dadosUsuario: Partial<Usuario>) {
		return await this.prisma.usuario.create({
			data: {
				email: dadosUsuario.email || '',
				senha: dadosUsuario.senha || '',
				nome: dadosUsuario.nome || '',
				role: dadosUsuario.role || 'USER',
			},
		});
	}

	async existeUsuario(email: string) {
		return await this.prisma.usuario.findUnique({
			where: {
				email: email,
			},
		});
	}

	async criarToken(dadosToken: Omit<Token, 'id' | 'revoked'>) {
		return await this.prisma.token.create({
			data: dadosToken,
		});
	}

	async buscarTokenRefresh(token: string) {
		return await this.prisma.token.findFirst({
			where: {
				token,
				type: 'REFRESH',
				revoked: false,
			},
		});
	}

	async revogarToken(id: number) {
		return await this.prisma.token.update({
			where: { id },
			data: { revoked: true },
		});
	}
}

export const authRepository = new AuthRepository(prisma);
