import DatabaseManager from '../config/database';
import Atendente from '../models/atendente';

class AtendenteController {
    atendente: typeof Atendente;

    constructor() {
        this.atendente = Atendente;
    }

    async createAtendente(atendenteData: any) {
        const connection = DatabaseManager.getInstance().getConnection();
        const query = `
            INSERT INTO atendente (nome, cpf, senha)
            VALUES (?, ?, ?)
        `;
        try {
            const [result] = await connection.execute(query, [
                atendenteData.nome, 
                atendenteData.cpf, 
                atendenteData.senha
            ]);
            return { id: result.insertId, ...atendenteData };
        } catch (error) {
            console.error('Erro ao criar atendente:', error);
            throw error;
        } finally {
            connection.end();  // Agora o método `end()` da conexão é chamado corretamente
        }
    }

    async atualizaAtendente(id, dados) {
        try {
            
        } catch (e) {
            throw e;
        }
    }

    async deletarAtendente(id) {
        const connection = DatabaseManager.getInstance().getConnection();
        try {
            const query = `DELETE FROM atendente WHERE id = ${id}`;
            await connection.execute(query, [id]);
            return true;
        } catch (error) {
            console.error('Erro ao deletar atendente:', error);
            throw error;
        } finally {
            connection.end();  // Fechando a conexão
        }
    }
}

export default AtendenteController;
