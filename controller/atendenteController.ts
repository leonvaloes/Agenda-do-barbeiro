import DatabaseManager from '../config/database';
import Atendente from '../models/atendente';
import Servico from "../models/servicos";

class AtendenteController {
    atendente: typeof Atendente;

    constructor() {
        this.atendente = Atendente;
    }

    async createAtendente(atendenteData: any) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();
            const retorno = await Atendente.create(connection, atendenteData);
            if (retorno)
                await connection.commit();

        } catch (error) {
            console.error("Erro ao criar atendente:", error);
            await connection.rollback();
            throw error;
        } finally {
            connection.release;
        }
    }

    async listarAtendentes() {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const atendentes = await Atendente.listarAtendentes(connection);
            return atendentes;
        } catch (error) {
            console.error('Erro ao listar atendentes:', error);
            throw error;
        } finally {
            connection.release();
        }
    }


    async atualizaAtendente(id: number, dados: any) {
        const connection = await DatabaseManager.getInstance().getConnection();

        try {
            connection.beginTransaction();

            const atendenteModel = new Atendente("", "", "");
            const atendenteExistente = await Atendente.getAtendenteById(id, connection);

            if (!atendenteExistente.length) {
                throw new Error("Atendente não encontrado.");
            }
            // Atualiza os dados do atendente
            const atendenteAtualizado = await atendenteModel.update(id, connection, dados);

            connection.commit();
            return atendenteAtualizado;
        } catch (error) {
            connection.rollback();
            console.error('Erro ao atualizar atendente:', error);
            throw error;
        } finally {
            connection.release();
        }
    }


    async deletarAtendente(id: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();
            const atendenteModel = new Atendente("", "", "");
            const atendenteExistente = await Atendente.getAtendenteById(id, connection);
            if (!atendenteExistente.length) {
                throw new Error("Atendente não encontrado.");
            }
            const atendenteExcluido = await atendenteModel.delete(id, connection);
            connection.commit();
            return atendenteExcluido;
        } catch (error) {
            connection.rollback();
            console.error('Erro ao deletar atendente:', error);
            throw error;
        } finally {
            connection.release();
        }
    }


    async criarServicoEAssociar(data: any, atendenteId: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
    
        try {
            await connection.beginTransaction();
            const AtendenteModel = new Atendente("", "", "");
    
            // Criando o serviço
            const servico = await Servico.create(connection, data);    
            await AtendenteModel.Associar(connection, servico, atendenteId);         
            connection.commit();
            return servico.id;
        } catch (error) {
            await connection.rollback();
            console.error("Erro ao criar serviço e associar ao atendente:",error);
            throw error;
        }
    }
    
    
}

export default AtendenteController;
