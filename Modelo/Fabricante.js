import FabricanteDAO from "../Persistencia/fabricanteDAO.js";
//não esqueça do .js no final da importação

export default class Fabricante{
    //definição dos atributos privados
    #codigo;
    #empresa;

    constructor(codigo=0, empresa=''){
        this.#codigo=codigo;
        this.#empresa=empresa;
    }

    //métodos de acesso públicos

    get codigo(){
        return this.#codigo;
    }

    set codigo(novoCodigo){
        this.#codigo = novoCodigo;
    }

    get empresa(){
        return this.#empresa;
    }

    set empresa(novaEmpresa){
        this.#empresa = novaEmpresa;
    }

    //override do método toJSON
    toJSON()     
    {
        return {
            codigo:this.#codigo,
            empresa:this.#empresa
        }
    }

    async gravar(){
        const fabricanteDAO = new FabricanteDAO();
        await fabricanteDAO.gravar(this);
    }

    async excluir(){
        const fabricanteDAO = new FabricanteDAO();
        await fabricanteDAO.excluir(this);
    }

    async atualizar(){
        const fabricanteDAO = new FabricanteDAO();
        await fabricanteDAO.atualizar(this);

    }

    async consultar(parametro){
        const fabricanteDAO = new FabricanteDAO();
        return await fabricanteDAO.consultar(parametro);
    }
    async possuiProdutos(){
        const fabricanteDAO = new FabricanteDAO();
        return await fabricanteDAO.possuiProdutos(this);
    }
}