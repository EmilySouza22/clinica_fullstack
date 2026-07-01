import express from 'express';
import cors from "cors"

import { auth } from './middleware/auth';

import { authRouter } from './routes/auth';
import { usuarioRouter, usuarioPublicRouter } from './routes/usuario';
import { exameRouter } from './routes/exame';
import { consultaRouter } from "./routes/consulta";
import { pacienteRouter } from "./routes/paciente";

const app = express();
app.use(express.json())
app.use(cors())
const port = 3000;

app.get('/', (req, res) => {
  console.log(req)
  res.send("Hello world")
})

app.use(authRouter)
app.use(usuarioPublicRouter) // cadastro, sem auth

app.use(auth) // a partir daqui, tudo exige token

app.use(usuarioRouter)
app.use(exameRouter)
app.use(consultaRouter)
app.use(pacienteRouter)

app.listen(port, () => {
  console.log("Servidor ta de pé :p")
})