class Atendente{
    id: number;
    nome: string;
    cpf: string;
    senha: string;

    constructor( nome: string, cpf: string, senha: string){
        this.nome = nome;
        this.cpf = cpf;
        this.senha = senha;
    }
    
    static async create(connection: any, data: Atendente) {
        const query = `INSERT INTO atendente (nome, cpf, senha) VALUES (?, ?, ?)`;
        try {
            const result = await connection.execute(query, [data.nome, data.cpf, data.senha]);
            return result;
        } catch (error) {
            console.error('Erro ao inserir atendente:', error);
            throw error;
        }
    }
    

    async delete(id: number, connection: any) {
        const query = `DELETE FROM atendente WHERE id = ?`;
        try {
            await connection.execute(query, [id]);
            return {
                id: id,
                nome: this.nome,
                cpf: this.cpf
            };
        } catch (error) {
            console.error('Erro ao deletar atendente:', error);
            throw error;
        }
    }

    async update(id: number, connection: any, data: any) {
        const query = `UPDATE atendente SET nome = ?, cpf = ?, senha = ? WHERE id = ?`;
        try {
            await connection.execute(query, [data.nome, data.cpf, data.senha, id]);
            // Retorna os dados atualizados
            return { id, ...data };
        } catch (error) {
            console.error('Erro ao atualizar atendente:', error);
            throw error;
        }
    }
    
    async buscaAtendente(id: number, connection: any){
        const query = `SELECT * FROM atendente WHERE id = ?`;
        try {
            const result: any = await connection.execute(query, [id]);
            return result[0];
        } catch (error) {
            console.error('Erro ao buscar atendente:', error);
            throw error;
        }
    }

    static async listarAtendentes(connection: any){
        const query = `SELECT * FROM atendente`;
        try {
            const result: any = await connection.execute(query);
            return result[0];
        } catch (error) {
            console.error('Erro ao listar atendentes:', error);
            throw error;
        }
    }
}

export default Atendente;