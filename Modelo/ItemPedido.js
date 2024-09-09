export default class ItemPedido {
    #maquina;
    #quantidade;
    #precoUnitario;

    constructor(maquina, quantidade, precoUnitario) {
        this.#maquina = maquina;
        this.quantidade = quantidade; 
        this.precoUnitario = precoUnitario; 
    }

    get maquina() {
        return this.#maquina;
    }

    set maquina(novomaquina) {
        this.#maquina = novomaquina;
    }

    get quantidade() {
        return this.#quantidade;
    }

    set quantidade(novaQuantidade) {
        if (novaQuantidade < 0) {
            throw new Error("Quantidade não pode ser negativa.");
        }
        this.#quantidade = novaQuantidade;
    }

    get precoUnitario() {
        return this.#precoUnitario;
    }

    set precoUnitario(novoPrecoUnitario) {
        if (novoPrecoUnitario < 0) {
            throw new Error("Preço unitário não pode ser negativo.");
        }
        this.#precoUnitario = novoPrecoUnitario;
    }

    get subtotal() {
        return this.#quantidade * this.#precoUnitario;
    }

    // JSON
    toJSON() {
        return {
            maquina: this.#maquina,
            quantidade: this.#quantidade,
            precoUnitario: this.#precoUnitario,
            subtotal: this.subtotal
        };
    }
}