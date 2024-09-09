//camada de interface da API que traduz HTTP
import Fabricante from "../Modelo/Fabricante.js";

export default class FabricanteCtrl {

    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const empresa = dados.empresa;
            if (empresa) {
                const fabricante = new fabricante(0, empresa);
                //resolver a promise
                fabricante.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": fabricante.codigo,
                        "mensagem": "fabricante cadastrado com sucesso!"
                    });
                })
                    .catch((erro) => {  
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao registrar o fabricante:" + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe a descrição do fabricante!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para cadastrar um fabricante!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const empresa = dados.empresa;
            if (codigo && empresa) {
                const fabricante = new fabricante(codigo, empresa);
                //resolver a promise
                fabricante.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "fabricante atualizado com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao atualizar o fabricante:" + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código e a descrição do fabricante!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar um fabricante!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo) {
                const fabricante = new Fabricante(codigo);
                fabricante.possuiProdutos(resposta =>{
                    if(resposta == false){
                        fabricante.excluir().then(() => {
                            resposta.status(200).json({
                                "status": true,
                                "mensagem": "fabricante excluído com sucesso!"
                            });
                        })
                        
                        .catch((erro) => {
                                resposta.status(500).json({
                                    "status": false,
                                    "mensagem": "Erro ao excluir o fabricante:" + erro.message
                                });
                        });
                    }
                    else {
                        resposta.status(400).json({
                            "status": false,
                            "mensagem": "Esse fabricante possui produtos e não pode ser excluído!"
                    });
                        }  
                    }                    
                );
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código do fabricante!"
                });
                }           
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir um fabricante!"
            });
        }
        
    }


    consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo;
        if (!termo){
            termo = "";
        }
        if (requisicao.method === "GET"){
            const fabricante = new Fabricante();
            fabricante.consultar(termo).then((listaFabricantes)=>{
                resposta.json(
                    {
                        status:true,
                        listaFabricantes
                    });
            })
            .catch((erro)=>{
                resposta.json(
                    {
                        status:false,
                        mensagem:"Não foi possível obter as Marcas: " + erro.message
                    }
                );
            });
        }
        else 
        {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar fabricantes!"
            });
        }
    }
}