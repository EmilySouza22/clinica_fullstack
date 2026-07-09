import type { Request, Response } from 'express';
import type { Usuario } from '../prisma/generated/prisma/client';
import { AuthService, authService } from '../services/AuthService';

class AuthController {
	constructor(private readonly service: AuthService) {}

	async cadastrar(req: Request, res: Response) {
		try {
			const dadosUsuario = req.body as Usuario;
			const usuarioCriado = await this.service.cadastrar(dadosUsuario);
			return res.status(201).json({
				message: 'Usuário criado com sucesso!',
				data: usuarioCriado,
			});
		} catch (error) {
			console.log(error);
			return res.status(404).json({
				error: error instanceof Error ? error.message : String(error),
			});
		}
	}

	async logar(req: Request, res: Response) {
		try {
			const dadosUsuario = req.body as Partial<Usuario>;
			const dadosLogin = await this.service.logar(dadosUsuario);
			return res.status(200).json({
				message: 'Usuário autenticado com sucesso!',
				accessToken: dadosLogin.tokenAcesso,
				refreshToken: dadosLogin.tokenRefresh,
			});
		} catch (error) {
			console.log(error);
			return res.status(404).json({
				error: error instanceof Error ? error.message : String(error),
			});
		}
	}

	async atualizarToken(req: Request, res: Response) {
		try {
			const { refreshToken } = req.body as { refreshToken?: string };
			if (!refreshToken) {
				return res.status(400).json({ error: 'refreshToken é obrigatório' });
			}
			const dados = await this.service.atualizarToken(refreshToken);
			return res.status(200).json({
				message: 'Token atualizado com sucesso!',
				accessToken: dados.tokenAcesso,
				refreshToken: dados.tokenRefresh,
			});
		} catch (error) {
			console.log(error);
			return res.status(401).json({
				error: error instanceof Error ? error.message : String(error),
			});
		}
	}
}
export const authController = new AuthController(authService);
