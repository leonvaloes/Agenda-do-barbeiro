class Servicos{
    id: number;
    nome: string;
    descricao: string;
    valor: number;
    tempoMedio: number;

    constructor(id: number, nome: string, descricao: string, valor: number, tempoMedio: number){
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.valor = valor;
        this.tempoMedio = tempoMedio;
    }
}

export default Servicos;
