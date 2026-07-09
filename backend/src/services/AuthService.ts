import type { Usuario } from '../prisma/generated/prisma/client';
import { createHash } from '../utils/createHash';
import bcrypt from 'bcrypt';
import {
	signTokenAcesso,
	signTokenRefresh,
	verificarTokenRefresh,
	getToken,
} from '../utils/jwt';
import { AuthRepository, authRepository } from '../repositories/AuthRepository';

export class AuthService {
	constructor(private readonly repository: AuthRepository) {}

	async cadastrar(dadosUsuario: Usuario) {
		const hash = await createHash(dadosUsuario.senha);

		const usuarioCriado = await this.repository.cadastrar({
			email: dadosUsuario.email,
			nome: dadosUsuario.nome || null,
			role: dadosUsuario.role,
			senha: hash,
		});
		return usuarioCriado;
	}

	async logar(dadosUsuario: Partial<Usuario>) {
		const existeUsuario = await this.repository.existeUsuario(
			dadosUsuario.email || '',
		);
		const credenciaisValidas = await bcrypt.compare(
			dadosUsuario.senha || '',
			existeUsuario?.senha || '',
		);
		console.log(existeUsuario, credenciaisValidas, dadosUsuario);
		if (existeUsuario && credenciaisValidas) {
			const tokenAcesso = signTokenAcesso({
				email: existeUsuario.email,
				nome: existeUsuario.nome,
				role: existeUsuario.role,
			});
			const tokenRefresh = signTokenRefresh({
				email: existeUsuario.email,
				nome: existeUsuario.nome,
				role: existeUsuario.role,
			});

			const accessExpires = new Date();
			const accessExpiresUpdate = accessExpires.setHours(
				accessExpires.getHours() + 1,
			);
			// acesso create
			await this.repository.criarToken({
				token: tokenAcesso,
				expiresAt: new Date(accessExpiresUpdate),
				type: 'ACCESS',
				usuarioId: existeUsuario.id,
			});

			//refresh create
			const refreshExpires = new Date();
			const refreshExpiresUpdated = refreshExpires.setMonth(
				refreshExpires.getMonth() + 1,
			);

			await this.repository.criarToken({
				token: tokenRefresh,
				expiresAt: new Date(refreshExpiresUpdated),
				type: 'REFRESH',
				usuarioId: existeUsuario.id,
			});

			return {
				tokenAcesso,
				tokenRefresh,
			};
		}

		throw new Error('Credenciais inválidas');
	}

	async atualizarToken(refreshToken: string) {
		try {
			verificarTokenRefresh(refreshToken);
		} catch {
			throw new Error('Refresh token inválido ou expirado');
		}

		const tokenSalvo = await this.repository.buscarTokenRefresh(refreshToken);
		if (!tokenSalvo || tokenSalvo.expiresAt < new Date()) {
			throw new Error('Refresh token inválido ou expirado');
		}

		await this.repository.revogarToken(tokenSalvo.id);

		const payload = getToken(refreshToken);
		const existeUsuario = await this.repository.existeUsuario(
			payload.email || '',
		);
		if (!existeUsuario) {
			throw new Error('Usuário não encontrado');
		}

		const novoTokenAcesso = signTokenAcesso({
			email: existeUsuario.email,
			nome: existeUsuario.nome,
			role: existeUsuario.role,
		});
		const novoTokenRefresh = signTokenRefresh({
			email: existeUsuario.email,
			nome: existeUsuario.nome,
			role: existeUsuario.role,
		});

		const accessExpires = new Date();
		const accessExpiresUpdate = accessExpires.setHours(
			accessExpires.getHours() + 1,
		);
		await this.repository.criarToken({
			token: novoTokenAcesso,
			expiresAt: new Date(accessExpiresUpdate),
			type: 'ACCESS',
			usuarioId: existeUsuario.id,
		});

		const refreshExpires = new Date();
		const refreshExpiresUpdated = refreshExpires.setMonth(
			refreshExpires.getMonth() + 1,
		);
		await this.repository.criarToken({
			token: novoTokenRefresh,
			expiresAt: new Date(refreshExpiresUpdated),
			type: 'REFRESH',
			usuarioId: existeUsuario.id,
		});

		return {
			tokenAcesso: novoTokenAcesso,
			tokenRefresh: novoTokenRefresh,
		};
	}
}

export const authService = new AuthService(authRepository);
