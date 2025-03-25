class Cliente {

    id: number;
    nome: string;
    cpf: string;
    senha: string;
    cidade: string;

    constructor( nome: string, cpf: string, senha: string, cidade: string) {
        this.nome = nome;
        this.cpf = cpf;
        this.senha = senha;
        this.cidade = cidade;
    }

    async create( data:Cliente , connection: any ){
        const query = `INSERT INTO cliente (nome, cpf, senha, cidade) VALUES (?, ?, ?, ?)`;
        const values = [data.nome, data.cpf, data.senha, data.cidade];
        try {
            const [result] = await connection.execute(query, values);
            return result;
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            throw error;
        }
    }

    async delete(id: number, connection: any) {
        const query = `DELETE FROM atendente WHERE id = ?`;
        try {
            const result = await connection.execute(query, [id]);
            return result;
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            throw error;
        }
    }

    async update(data: Cliente, connection: any) {
        const query = `UPDATE cliente SET nome = ?, cpf = ?, senha = ?, cidade = ? WHERE id = ?`;
        const values = [data.nome, data.cpf, data.senha, data.cidade, data.id];
        try {
            await connection.execute(query, values);
            return true;
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            throw error;
        }
    }

    
    async buscaCliente(id:number, connection: any) {
        const query = `SELECT * FROM cliente WHERE id = ?`;
        try {
            const result = await connection.execute(query, id);
            return result;
        } catch (error) {
            console.error('Erro ao buscar cliente:', error);
            throw error;
        }
    }

}

export = Cliente;