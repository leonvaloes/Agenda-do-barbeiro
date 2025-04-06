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

    constructor(nome: string, email: string, cnpj: string, cidade: string, endereco: string, estado: string, telefone: string, senha: string) {
        this.nome = nome;
        this.email = email;
        this.cnpj = cnpj;
        this.cidade = cidade;
        this.endereco = endereco;
        this.estado = estado;
        this.telefone = telefone;
        this.senha = senha;
    }

    static async create (data: Empresa, connection:any){
        const query = `INSERT INTO empresa (nome, email, cnpj, cidade, endereco, estado, telefone, senha) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [data.nome, data.email, data.cnpj, data.cidade, data.endereco, data.estado, data.telefone, data.senha];
        try {
            const result = await connection.execute(query, values);
            return result;
        } catch (error) {
            console.error('Erro ao criar empresa:', error);
            throw error;
        }
    }

    static async delete (id: number, connection:any){
        const query = `DELETE FROM empresa WHERE id = ?`;
        try {
            const result = await connection.execute(query, [id]);
            return result;
        } catch (error) {
            console.error('Erro ao deletar empresa:', error);
            throw error;
        }
    }

    static async update (id:number, data: Empresa, connection:any){
        const query = `UPDATE empresa SET nome = ?, email = ?, cnpj = ?, cidade = ?, endereco = ?, estado = ?, telefone = ?, senha = ? WHERE id = ?`;
        try {
            await connection.execute(query, [data.nome, data.email, data.cnpj, data.cidade, data.endereco, data.estado, data.telefone, data.senha, id]);
            return {id,...data};
        } catch (error) {
            console.error('Erro ao atualizar empresa:', error);
            throw error;
        }
    }

    async buscaEmpresa(id:number, connection: any) {
        const query = `SELECT * FROM empresa WHERE id = ?`;
        try {
            const result:any= await connection.execute(query, [id]);
            return result[0];
        } catch (error) {
            console.error('Erro ao buscar empresa:', error);
            throw error;
        }
    }
}

export default Empresa;