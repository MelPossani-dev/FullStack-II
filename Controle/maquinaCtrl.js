import Maquina from "../Modelo/maquina.js";
import Fabricante from "../Modelo/Fabricante.js";

export default class MaquinaCtrl {

    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const modelo = dados.modelo;
            const processador = dados.processador;
            const memoria = dados.memoria;
            const ssd = dados.ssd;
            const precoCusto = dados.precoCusto;
            const precoVenda = dados.precoVenda;
            const qtdEstoque = dados.qtdEstoque;
            const fab_codigo = dados.fab_codigo;

            if (modelo && processador && memoria && ssd && precoCusto > 0 && precoVenda > 0
                && qtdEstoque >= 0 && fab_codigo > 0) {
                const fabricante = new Fabricante(fab_codigo);
                const maquina = new Maquina(0, modelo, processador, memoria, ssd, precoCusto, precoVenda, qtdEstoque, fabricante);
                maquina.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": maquina.codigo,
                        "mensagem": "Máquina cadastrada com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao registrar a máquina:" + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, os dados da máquina segundo a documentação da API!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para cadastrar uma máquina!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const modelo = dados.modelo;
            const processador = dados.processador;
            const memoria = dados.memoria;
            const ssd = dados.ssd;
            const precoCusto = dados.precoCusto;
            const precoVenda = dados.precoVenda;
            const qtdEstoque = dados.qtdEstoque;
            const fab_codigo = dados.fab_codigo;
            if (modelo && processador && memoria && ssd && precoCusto > 0 && precoVenda > 0
                && qtdEstoque >= 0 && fab_codigo > 0) {
                const fabricante = new Fabricante(fab_codigo);
                const maquina = new Maquina(codigo, modelo, processador, memoria, ssd, precoCusto, precoVenda, qtdEstoque, fabricante);
                maquina.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Máquina atualizada com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao atualizar a máquina:" + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados da máquina segundo a documentação da API!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar uma máquina!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo) {
                const maquina = new Maquina(codigo);
                //resolver a promise
                maquina.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Máquina excluído com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao excluir o máquina:" + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código do máquina!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir um máquina!"
            });
        }
    }


    consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = "";
        }
        if (requisicao.method === "GET") {
            const maquina = new Maquina();
            maquina.consultar(termo).then((listamaquinas) => {
                resposta.json(
                    {
                        status: true,
                        listamaquinas
                    });
            })
                .catch((erro) => {
                    resposta.json(
                        {
                            status: false,
                            mensagem: "Não foi possível obter as máquinas: " + erro.message
                        }
                    );
                });
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar as máquinas!"
            });
        }
    }
}