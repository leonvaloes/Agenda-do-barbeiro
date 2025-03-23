class Atendente{
    id: number;
    nome: string;
    cpf: string;
    senha: string;

    constructor(id: number, nome: string, cpf: string, senha: string){
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.senha = senha;
    }
}


export default Atendente;
