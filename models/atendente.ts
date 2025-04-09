import User from "./user";

class Atendente extends User {
    cpf: string;
  
    constructor(nome: string, cpf: string, senha: string) {
      super(nome, senha);
      this.cpf = cpf;
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
    
    static async getAtendenteById(id: number, connection: any){
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


    async Associar(connection: any, servicoId: number, atendenteId: number) {
        try {
            await connection.beginTransaction();
    
            // Verifica se os parâmetros são válidos
            if (!atendenteId || !servicoId) {
                throw new Error(`Parâmetros inválidos: atendenteId=${atendenteId}, servicoId=${servicoId}`);
            }
    
            // Criando a relação na tabela intermediária
            const queryAssociacao = `INSERT INTO atendente_serv (atendente_id, serv_id) VALUES (?, ?)`;
            await connection.execute(queryAssociacao, [atendenteId, servicoId]);
    
            connection.commit();
            console.log("Serviço associado ao atendente com sucesso!");
    
            return servicoId;
        } catch (error) {
            await connection.rollback();
            console.error("Erro ao associar serviço ao atendente:", error);
            throw error;
        }
    }   
}

export default Atendente;