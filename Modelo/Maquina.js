import MaquinaDAO from "../Persistencia/MaquinaDAO.js";
import Fabricante from "./Fabricante.js";

export default class Maquina{
    #codigo;
    #modelo;
    #processador;
    #memoria;
    #ssd;
    #precoCusto;
    #precoVenda;
    #qtdEstoque;
    #fabricante;


    constructor(codigo=0,modelo='', processador='',memoria="",ssd="", precoCusto=0, 
                precoVenda=0, qtdEstoque=0, fabricante=""
                ){
        this.#codigo=codigo;
        this.#modelo=modelo;
        this.#processador=processador;
        this.#memoria=memoria;
        this.#ssd=ssd;
        this.#precoCusto=precoCusto;
        this.#precoVenda=precoVenda;
        this.#qtdEstoque=qtdEstoque;
        this.#fabricante=fabricante;
    }

    get codigo(){
        return this.#codigo;
    }
    set codigo(novoCodigo){
        this.#codigo = novoCodigo;
    }

    get modelo(){
        return this.#modelo;
    }

    set modelo(novoMod){
        this.#modelo=novoMod;

    }

    get processador(){
        return this.#processador;
    }

    set processador(novoProc){
        this.#processador=novoProc;
    }
    get memoria(){
        return this.#memoria;
    }

    set memoria(novaMem){
        this.#memoria=novaMem;
    }

    get ssd(){
        return this.#ssd;
    }

    set ssd(novoSSD){
        this.#ssd=novoSSD;
    }

    get precoCusto(){
        return this.#precoCusto;
    }

    set precoCusto(novoPreco){
        this.#precoCusto = novoPreco
    }

    get precoVenda(){
        return this.#precoVenda;
    }
    
    set precoVenda(novoPreco){
        this.#precoVenda = novoPreco
    }

    get qtdEstoque(){
        return this.#qtdEstoque;
    }

    set qtdEstoque(novaQtd){
        this.#qtdEstoque = novaQtd;
    }
    get fabricante(){
        return this.#fabricante;
    }

    set fabricante(novoFabricante){
        if (novoFabricante instanceof Fabricante)
            this.#fabricante = novoFabricante;
    }


    toJSON(){
        return {
            codigo:this.#codigo,
            modelo:this.#modelo,
            processador:this.#processador,
            memoria:this.#memoria,
            ssd:this.#ssd,
            precoCusto:this.#precoCusto,
            precoVenda:this.#precoVenda,
            qtdEstoque:this.#qtdEstoque,
            fabricante:this.#fabricante
        }
    }

     //camada de modelo acessa a camada de persistencia
     async gravar(){
        const maqDAO = new MaquinaDAO();
        await maqDAO.gravar(this);
     }
 
     async excluir(){
        const maqDAO = new MaquinaDAO();
        await maqDAO.excluir(this);
     }
 
     async atualizar(){
        const maqDAO = new MaquinaDAO();
        await maqDAO.atualizar(this);
     }
 
     async consultar(termo){
        const maqDAO = new MaquinaDAO();
        return await maqDAO.consultar(termo);
     }

}