import express from 'express';
import cors from 'cors';
import rotaMaquina   from './Rotas/rotaMaquina.js';
import rotaFabricante from './Rotas/rotaFabricante.js';
import session from 'express-session';
import dotenv from 'dotenv';	
import rotaAutenticacao from './Rotas/rotaAutenticacao.js'
import { verificarAutenticacao } from './Seguranca/autenticar.js';
import rotaCliente from './Rotas/rotaCliente.js';
import rotaPedido from './Rotas/rotaPedido.js';

dotenv.config();
const host='0.0.0.0';
const porta=3000;

const app = express();

app.use(session({
    secret: process.env.CHAVE_SECRETA,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 15 }
}));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/fabricante', /*verificarAutenticacao*/rotaFabricante);
app.use('/maquina', /*verificarAutenticacao*/rotaMaquina);
app.use('/autenticacao',/*verificarAutenticacao*/rotaAutenticacao);
app.use('/cliente', /*verificarAutenticacao*/rotaCliente);
app.use('/pedido', /*verificarAutenticacao*/rotaPedido);

app.listen(porta, host, ()=>{
    console.log(`Servidor escutando na porta ${host}:${porta}.`);
})
