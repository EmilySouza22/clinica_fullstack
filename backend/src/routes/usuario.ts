import { Router } from "express";
import { userController } from "../controllers/UserController";

export const usuarioRouter = Router();
export const usuarioPublicRouter = Router();

// Rota pública (cadastro)
usuarioPublicRouter.post("/usuarios", async (req, res) => {
  return userController.criarUsuario(req, res)
})

// Rotas protegidas
usuarioRouter.get('/usuarios', async (_, res) => {
  return userController.listarTodosUsuarios(_, res)
})

usuarioRouter.get('/usuarios/:id', async (req, res) => {
  return userController.buscarUsuarioId(req, res)
})

usuarioRouter.post("/usuarios", async (req, res) => {
  return userController.criarUsuario(req, res)
})

usuarioRouter.put("/usuarios/:id", async (req, res) => {
  return userController.atualizarUsuario(req, res)
})

usuarioRouter.delete('/usuarios/:id', async (req, res) => {
  return userController.deletarUsuario(req, res)
})
