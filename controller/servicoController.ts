import DatabaseManager from "../config/database";
import Servico from '../models/servicos';

class ServicoController {

    servico: typeof Servico;

    constructor() {
        this.servico = Servico;
    }

    async criarServico(dados: any) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();
    
            const servicoId = await Servico.create(connection, dados);
            if (!servicoId) {
                return null;
            }
    
            connection.commit();
            return servicoId; // Retorna o ID do serviço criado
        } catch (error) {
            connection.rollback();
            return "Erro ao criar serviço";
        } finally {
            connection.release();
        }
    }
    

    async atualizarServico(id:number, dados:number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();

            const servico= await Servico.getServicoById(id, connection);
            if(!servico){
                return null;
            }
            const retorno = await servico.update(connection, dados, id);
            connection.commit();
            return retorno;
        } catch (error) {
            connection.rollback();
            return "Erro ao atualizar serviço";
        } finally {
            connection.release();
        }
    }

    async deletarServico(id) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();
            const servico= await Servico.getServicoById(id, connection);
            if(!servico)
                return null;
            
            const retorno = await servico.delete(connection, id);
            connection.commit();
            return retorno;
        } catch (error) {
            connection.rollback();
            return "Erro ao deletar serviço";
        } finally {
            connection.release();
        }
    }

    async listarServicos() {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const servicos= await Servico.listarServicos(connection);
            return servicos;
        } catch (error) {
            return "Erro ao listar serviços";
        } finally {
            connection.release();
        }
    }
}

export default ServicoController;
