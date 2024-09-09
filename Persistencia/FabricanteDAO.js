import Fabricante from "../Modelo/Fabricante.js";
import conectar from "./conexao.js";
//DAO = Data Access Object -> Objeto de acesso aos dados
export default class FabricanteDAO{

    constructor() {
        this.init();
    }
    
    async init() {
        try 
        {
            const conexao = await conectar(); //retorna uma conexão
            const sql = `
                CREATE TABLE IF NOT EXISTS fabricante(
                    fab_codigo INT NOT NULL AUTO_INCREMENT,
                    fab_empresa VARCHAR(100) NOT NULL,
                    CONSTRAINT pk_fabricante PRIMARY KEY(fab_codigo)
                );`;
            await conexao.execute(sql);
            await conexao.release();
        }
        catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }
    async gravar(fabricante){
        if (fabricante instanceof Fabricante){
            const sql = "INSERT INTO fabricante(fab_empresa) VALUES(?)"; 
            const parametros = [fabricante.empresa];
            const conexao = await conectar(); //retorna uma conexão
            const retorno = await conexao.execute(sql,parametros); //prepara a sql e depois executa
            fabricante.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(fabricante){
        if (fabricante instanceof Fabricante){
            const sql = "UPDATE fabricante SET fab_empresa = ? WHERE fab_codigo = ?"; 
            const parametros = [fabricante.empresa, fabricante.codigo];
            const conexao = await conectar(); //retorna uma conexão
            await conexao.execute(sql,parametros); //prepara a sql e depois executa
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(fabricante){
        if (fabricante instanceof Fabricante){
            // excluir uma categoria implica em excluir antes todos os seus produtos
            // para nao violar a integridade referencial do banco de dados
            // a restrição deve ser implementada na camada de Controle
            const sql = "DELETE FROM fabricante WHERE fab_codigo = ?"; 
            const parametros = [fabricante.codigo];
            const conexao = await conectar(); //retorna uma conexão
            await conexao.execute(sql,parametros); //prepara a sql e depois executa
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(parametroConsulta){
        let sql='';
        let parametros=[];
        //é um número inteiro?
        if (!isNaN(parseInt(parametroConsulta))){
            //consultar pelo código da fabricante
            sql='SELECT * FROM fabricante WHERE fab_codigo = ? order by fab_empresa';
            parametros = [parametroConsulta];
        }
        else{
            //consultar pela empresa
            if (!parametroConsulta){
                parametroConsulta = '';
            }
            sql = "SELECT * FROM fabricante WHERE fab_empresa like ?";
            parametros = ['%'+parametroConsulta+'%'];
        }
        const conexao = await conectar();
        const [registros, campos] = await conexao.execute(sql,parametros);
        let listafabricantes = [];
        for (const registro of registros){
            const fabricante = new Fabricante(registro.fab_codigo,registro.fab_empresa);
            listafabricantes.push(fabricante);
        }
        return listafabricantes;
    }

    async possuiProdutos(fabricante){
        if (fabricante instanceof Fabricante){
            const sql = `SELECT count(*) as qtd FROM maquina m
                         INNER JOIN fabricante f ON m.fab_codigo = f.fab_codigo
                         WHERE m.fab_codigo = ?`;
            const parametros = [fabricante.codigo];
            const [registros, campos] = await global.poolConexoes.execute(sql,parametros);
            return registros[0].qtd > 0;
};
    }
}