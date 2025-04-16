import DatabaseManager from '../config/database';
import Atendente from '../models/atendente';
import HorarioFuncionario from '../models/horariosFuncionario';
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
    
            const atendente = new Atendente(atendenteData.nome, atendenteData.cpf, atendenteData.senha, 0);
            const result = await atendente.createAtendente(connection);

            // Garantir que o ID do usuário seja atribuído ao atendente
            const atendente_id= result.id;
            
            await HorarioFuncionario.gerarHorariosFuncionario(atendente_id, connection);
            console.log("teste?");
            await connection.commit();
            return atendente;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
    

    async listarAtendentes() {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const atendentes = await Atendente.listarAtendentes(connection);
            if (atendentes)
                return atendentes;
            else
                throw new Error("Nenhum atendente encontrado");
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }


    async atualizaAtendente(id: number, dados: any) {
        const connection = await DatabaseManager.getInstance().getConnection();

        try {
            connection.beginTransaction();

            const atendenteModel = new Atendente("", "", "", 0);
            const atendenteExistente = await Atendente.getAtendenteById(id, connection);

            if (atendenteExistente.length && dados.nome != null && dados.cpf != null && dados.senha != null) {
                const atendenteAtualizado = await atendenteModel.update(id, connection, dados);
                connection.commit();
                return atendenteAtualizado;
            }
            return null;
        } catch (error) {
            connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }


    async deletarAtendente(id: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();
            const atendenteModel = new Atendente("", "", "", 0);
            const atendenteExistente = await Atendente.getAtendenteById(id, connection);

            if (!atendenteExistente.length)
                throw new Error("Atendente não encontrado");
            
            const atendenteExcluido = await atendenteModel.delete(id, connection);
            connection.commit();
            return atendenteExcluido;
        } catch (error) {
            connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async criarServicoEAssociar(data: any, atendenteId: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();
            const AtendenteModel = new Atendente("", "", "", 0);

            const servico = await Servico.create(connection, data);
            await AtendenteModel.Associar(connection, servico, atendenteId);
            connection.commit();
            return servico.id;
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    }
}

export default AtendenteController;
