import User from "./user";

class Atendente extends User {
    cpf: string;
    atendente_user_id:number;
  
    constructor(nome: string, cpf: string, senha: string, atendente_user_id:number) {
      super(nome, senha);
      this.cpf = cpf;
      this.atendente_user_id= atendente_user_id;
    }
    
    async createAtendente(connection:any){
        this.atendente_user_id = await User.cadastrarUser(this.nome, this.senha, connection);
        const query = `INSERT INTO atendente (cpf, atendente_user_id) VALUES ( ?, ?)`;
        const values = [this.cpf, this.atendente_user_id];
        try {
            const result = await connection.execute(query, values);
            return result;
        } catch (error) {
            return null;
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
            return null;
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
            return null;
        }
    }
    
    static async getAtendenteById(id: number, connection: any){
        const query = `SELECT * FROM atendente WHERE id = ?`;
        try {
            const result: any = await connection.execute(query, [id]);
            return result[0];
        } catch (error) {
            console.error('Erro ao buscar atendente:', error);
            return null;
        }
    }

    static async listarAtendentes(connection: any){
        const query = `SELECT * FROM atendente`;
        try {
            const result: any = await connection.execute(query);
            return result[0];
        } catch (error) {
            console.error('Erro ao listar atendentes:', error);
            return null;
        }
    }

    async Associar(connection: any, servicoId: number, atendenteId: number) {
        try {    
            if (!atendenteId || !servicoId) {
                return null;
            }
            
            const queryAssociacao = `INSERT INTO atendente_serv (atendente_id, serv_id) VALUES (?, ?)`;
            await connection.execute(queryAssociacao, [atendenteId, servicoId]);
    
            console.log("Serviço associado ao atendente com sucesso!");
    
            return servicoId;
        } catch (error) {
            console.error("Erro ao associar serviço ao atendente:", error);
            return null;
        }
    }   
}

export default Atendente;