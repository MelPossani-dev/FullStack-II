import Pedido from "../Modelo/Pedido.js";
import Cliente from "../Modelo/Cliente.js";
import Fabricante from "../Modelo/Fabricante.js"; 
import Maquina from "../Modelo/maquina.js"; 
import ItemPedido from "../Modelo/ItemPedido.js";
import conectar from "./conexao.js";

export default class PedidoDAO {
    async gravar(pedido) {
        if (pedido instanceof Pedido) {
            const conexao = await conectar();
            await conexao.beginTransaction();
            try {
                const sql = `INSERT INTO pedido(cli_codigo, data_pedido, total) VALUES(?, str_to_date(?, "%d/%m/%y"), ?)`;
                const parametros = [pedido.cliente.codigo, pedido.data, pedido.total];
                const retorno = await conexao.execute(sql, parametros);
                pedido.codigo = retorno[0].insertId; 

                const sql2 = `INSERT INTO item_pedido(pedido_codigo, maq_codigo, quantidade, preco_unitario) VALUES (?, ?, ?, ?)`;
                for (const item of pedido.itens) {
                    const parametros2 = [pedido.codigo, item.maquina.codigo, item.quantidade, item.maquina.precoUnitario];
                    await conexao.execute(sql2, parametros2);
                }

                await conexao.commit();
            } catch (erro) {
                await conexao.rollback();
                throw erro;
            } finally {
                global.poolConexoes.releaseConnection(conexao);
            }  
        }
    }

    async alterar(pedido) {
    }

    async excluir(pedido) {
    }

    async consultar(termoBusca) {
        const listaPedidos = [];
        const conexao = await conectar();

        try {
            let sql;
            let parametros;

            if (!isNaN(termoBusca)) {
                sql = `SELECT p.codigo, p.cli_codigo, DATE(p.data_pedido) as data, p.total, 
                        cli.cli_nome, cli.cli_telefone, cli.cli_endereco, cli.cli_cpf, 
                        maq.maq_codigo, maq.maq_modelo, maq.maq_processador, maq.maq_memoria, maq.maq_ssd, maq.maq_precoCusto, maq.maq_precoVenda, maq.maq_qtdEstoque,
                        fab.fab_codigo, fab.fab_empresa, 
                        ip.maq_codigo, ip.quantidade, ip.preco_unitario, (ip.quantidade * ip.preco_unitario) as subtotal
                        FROM pedido as p
                        INNER JOIN cliente cli ON p.cli_codigo = cli.cli_codigo   
                        INNER JOIN item_pedido ip ON ip.pedido_codigo = p.codigo
                        INNER JOIN maquina maq ON maq.maq_codigo = ip.maq_codigo
                        INNER JOIN fabricante fab ON fab.fab_codigo = maq.fab_codigo
                        WHERE p.codigo = ?`;
                parametros = [termoBusca];
            } else {
                sql = `SELECT p.codigo, p.cli_codigo, DATE(p.data_pedido) as data, p.total, 
                        cli.cli_nome, cli.cli_telefone, cli.cli_endereco, cli.cli_cpf, 
                        maq.maq_codigo, maq.maq_modelo, maq.maq_processador, maq.maq_memoria, maq.maq_ssd, maq.maq_precoCusto, maq.maq_precoVenda, maq.maq_qtdEstoque,
                        fab.fab_codigo, fab.fab_empresa, 
                        ip.maq_codigo, ip.quantidade, ip.preco_unitario, (ip.quantidade * ip.preco_unitario) as subtotal
                        FROM pedido as p
                        INNER JOIN cliente cli ON p.cli_codigo = cli.cli_codigo   
                        INNER JOIN item_pedido ip ON ip.pedido_codigo = p.codigo
                        INNER JOIN maquina maq ON maq.maq_codigo = ip.maq_codigo
                        INNER JOIN fabricante fab ON fab.fab_codigo = maq.fab_codigo
                        WHERE cli.cli_nome like ?`;
                parametros = [termoBusca];
            }

            const [registros] = await conexao.execute(sql, parametros);

            if (registros.length > 0) {
                const cliente = new Cliente(registros[0].cli_codigo, registros[0].cli_nome, registros[0].cli_telefone, registros[0].cli_endereco, registros[0].cli_cpf);
                let listaItensPedido = [];
                for (const registro of registros) { 
                    const fabricante = new Fabricante(registro.fab_codigo, registro.fab_descricao);
                    const maquina = new Maquina(registro.maq_codigo, registro.maq_modelo, registro.processador, registro.maq_memoria, registro.maq_ssd, registro.maq_precoCusto, registro.maq_precoVenda, registro.maq_qtdEstoque, fabricante);
                    const itemPedido = new ItemPedido(maquina, registro.quantidade, registro.preco_unitario, registro.subtotal);
                    listaItensPedido.push(itemPedido);
                }
                const pedido = new Pedido(registros[0].codigo, cliente, registros[0].data_pedido, registros[0].total, listaItensPedido);
                listaPedidos.push(pedido);
            }
        } catch (erro) {
            throw erro;  // Adicione tratamento de erro adequado
        } finally {
            global.poolConexoes.releaseConnection(conexao);
        }

        return listaPedidos;
    }
}