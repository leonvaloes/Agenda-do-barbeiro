interface UserInterface{
    id: number;
    nome: string;
    senha: string;
}

class User {
    id: number;
    nome: string;
    senha: string;

    constructor(id: number, nome: string, senha: string) {
        this.id = id;
        this.nome = nome;
        this.senha = senha;
    }
}


export default User;
