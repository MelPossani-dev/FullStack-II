import { Router } from "express";
import MaquinaCtrl from "../Controle/MaquinaCtrl.js";

const maqCtrl = new MaquinaCtrl();
const rotaMaquina = new Router();

rotaMaquina
.get('/', maqCtrl.consultar)
.get('/:termo', maqCtrl.consultar)
.post('/', maqCtrl.gravar)
.patch('/', maqCtrl.atualizar)
.put('/', maqCtrl.atualizar)
.delete('/', maqCtrl.excluir);

export default rotaMaquina;