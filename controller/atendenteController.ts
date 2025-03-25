import DatabaseManager from '../config/database';
import Atendente from '../models/atendente';

class AtendenteController {
    atendente: typeof Atendente;

    constructor() {
        this.atendente = Atendente;
    }

    async createAtendente(atendenteData: any) {
        const connection = DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();
            const atendenteModel= new Atendente( atendenteData.nome, atendenteData.cpf, atendenteData.senha);
            await atendenteModel.create( atendenteModel , atendenteData);
            connection.commitTransaction();
        } catch (error) {

            connection.rollbackTransaction();
            console.error('Erro ao criar atendente:', error);
            throw error;
        }finally{
            connection.end();
        }
    }

    async atualizaAtendente(id: number, dados: any) {
        const connection = DatabaseManager.getInstance().getConnection();
    
        try {
            connection.beginTransaction();
            
            const atendenteModel = new Atendente("", "", "");
            const atendenteExistente = await atendenteModel.buscaAtendente(id, connection);
    
            if (!atendenteExistente.length) {
                throw new Error("Atendente não encontrado.");
            }
            // Atualiza os dados do atendente
            const atendenteAtualizado = await atendenteModel.update(id, connection, dados);
            
            connection.commitTransaction();
            return atendenteAtualizado;
        } catch (error) {
            connection.rollbackTransaction();
            console.error('Erro ao atualizar atendente:', error);
            throw error;
        } finally {
            connection.end();
        }
    }
    

    async deletarAtendente(id:number) {
        const connection = DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();
            const atendenteModel = new Atendente("", "", "");
            const atendenteExistente = await atendenteModel.buscaAtendente(id, connection);

            if(!atendenteExistente.length){
                throw new Error("Atendente não encontrado.");
            }

            const atendenteExcluido=await atendenteModel.delete(id, connection);
            connection.commitTransaction();
            return atendenteExcluido;

        } catch (error) {
            connection.rollbackTransaction();
            console.error('Erro ao deletar atendente:', error);
            throw error;

        } finally {
            connection.end(); 
        }
    }


}

export default AtendenteController;
