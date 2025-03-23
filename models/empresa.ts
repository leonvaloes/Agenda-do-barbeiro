class Empresa {
    id: number;
    nome: string;
    email: string;
    cnpj: string;
    cidade: string;
    endereco: string;
    estado: string;
    telefone: string;
    senha: string;

    constructor(id: number, nome: string, email: string, cnpj: string, cidade: string, endereco: string, estado: string, telefone: string, senha: string) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.cnpj = cnpj;
        this.cidade = cidade;
        this.endereco = endereco;
        this.estado = estado;
        this.telefone = telefone;
        this.senha = senha;
    }

}
export default Empresa;
