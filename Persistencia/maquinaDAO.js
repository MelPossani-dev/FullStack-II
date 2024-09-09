import Maquina from '../Modelo/maquina.js';
import conectar from './conexao.js';
import Fabricante from '../Modelo/Fabricante.js';

export default class maquinaDAO {

    constructor() {
        this.init();
    }

    async init() {
        try 
        {
            const conexao = await conectar(); //retorna uma conexão
            const sql = `
            CREATE TABLE IF NOT EXISTS maquina(
                maq_codigo INT NOT NULL AUTO_INCREMENT,
                maq_modelo VARCHAR(50) NOT NULL,
                maq_processador VARCHAR(25) NOT NULL,
                maq_memoria VARCHAR(15) NOT NULL DEFAULT 0,
                maq_ssd VARCHAR(15) NOT NULL,
                maq_precoCusto DECIMAL(10,2) NOT NULL DEFAULT 0,
                maq_precoVenda DECIMAL(10,2) NOT NULL DEFAULT 0,
                maq_qtdEstoque DECIMAL(10,2) NOT NULL DEFAULT 0,
                fab_codigo INT NOT NULL,
                CONSTRAINT pk_maquina PRIMARY KEY(cons_codigo),
                CONSTRAINT fk_fabricante FOREIGN KEY(fab_codigo) REFERENCES fabricante(fab_codigo)
            )
        `;
            await conexao.execute(sql);
            await conexao.release();
        }
        catch (e) {
            maquina.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }


    async gravar(maquina) {
        if (maquina instanceof maquina) {
            const sql = `INSERT INTO maquina(maq_modelo, maq_processador,
             maq_memoria, maq_ssd, maq_precoCusto, maq_precoVenda, maq_qtdEstoque, fab_codigo)
                VALUES(?,?,?,?,?,?,?,?)`;
            const parametros = [maquina.modelo, maquina.processador, maquina.memoria, maquina.ssd, maquina.precoCusto, maquina.precoVenda,
             maquina.qtdEstoque, maquina.fabricante.codigo];

            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            maquina.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }
    async atualizar(maquina) {
        if (maquina instanceof Maquina) {
            const sql = `UPDATE maquina SET maq_modelo = ?, maq_processador = ?, maq_memoria = ?,
             maq_ssd = ?, maq_precoCusto = ?, maq_precoVenda = ?, maq_qtdEstoque = ?, fab_codigo = ?
             WHERE maq_codigo = ?`;
            const parametros = [maquina.modelo, maquina.processador, maquina.memoria, maquina.ssd,
                 maquina.precoCusto, maquina.precoVenda,maquina.qtdEstoque, maquina.marca.codigo,
                 maquina.codigo];

            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(maquina) {
        if (maquina instanceof maquina) {
            const sql = `DELETE FROM maquina WHERE maq_codigo = ?`;
            const parametros = [maquina.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo) {
        if (!termo){
            termo="";
        }
        //termo é um número
        const conexao = await conectar();
        let listamaquinas = [];
        if (!isNaN(parseInt(termo))){
            //consulta pelo código do maquina
            const sql =`SELECT m.maq_codigo, m.maq_modelo, m.maq_processador, m.maq_memoria, m.maq_ssd,
                         m.maq_precoCusto, m.maq_precoVenda, m.maq_qtdEstoque, f.fab_codigo, f.fab_empresa
                         FROM maquina m 
                         INNER JOIN fabricante f ON f.fab_codigo = m.fab_codigo
                         WHERE m.maq_codigo like ?
                         ORDER BY m.maq_codigo`;
            const parametros=[termo];
            const [registros, campos] = await conexao.execute(sql,parametros);
            for (const registro of registros){
                const fabricante = new Fabricante(registro.fab_codigo, registro.fab_descricao);
                const maquina = new maquina(registro.maq_codigo, registro.maq_modelo, registro.maq_processador,
                                            registro.maq_memoria, registro.maq_ssd, registro.maq_precoCusto,
                                            registro.maq_precoVenda, registro.maq_qtdEstoque,
                                            fabricante
                                            );
                listamaquinas.push(maquina);
            }
        }
        else
        {
            //consulta pela descrição do maquina
            const sql = `SELECT m.maq_codigo, m.maq_modelo, m.maq_processador, m.maq_memoria, m.maq_ssd,
                         m.maq_precoCusto, m.maq_precoVenda, m.maq_qtdEstoque, f.fab_codigo, f.fab_empresa
                         FROM maquina m 
                         LEFT JOIN fabricante f ON m.fab_codigo = f.fab_codigo
                         WHERE m.maq_modelo like ?
                         ORDER BY m.maq_modelo`;
            const parametros=['%'+termo+'%'];
            const [registros, campos] = await conexao.execute(sql,parametros);
            for (const registro of registros){
                const fabricante = new Fabricante(registro.fab_codigo, registro.fab_empresa);
                const maquina = new maquina(registro.maq_codigo, registro.maq_modelo, registro.maq_processador,
                    registro.maq_memoria, registro.maq_ssd, registro.maq_precoCusto, registro.maq_precoVenda,
                    registro.maq_qtdEstoque, fabricante
                                            );
                listamaquinas.push(maquina);
            }
        }

        return listamaquinas;
 
    }
}