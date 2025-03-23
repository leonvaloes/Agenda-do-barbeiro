class Cliente {

    id: number;
    nome: string;
    cpf: string;
    senha: string;
    cidade: string;

    constructor(id: number, nome: string, cpf: string, senha: string, cidade: string) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.senha = senha;
        this.cidade = cidade;
    }

}


export = Cliente;