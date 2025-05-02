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
                throw new Error("Erro ao criar serviço");
            }
    
            connection.commit();
            return servicoId; // Retorna o ID do serviço criado
        } catch (error) {
            connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
    

    async atualizarServico(id:number, dados:any) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();
            

            const servico= await Servico.getServicoById(id, connection);
            if(!servico){
                throw new Error("Serviço não encontrado");
            }
            console.log(id);
            console.log(dados);
            const retorno = await Servico.update(connection, dados, id);
            connection.commit();
            return retorno;
        } catch (error) {
            connection.rollback();
            throw error;
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
                throw new Error("Serviço não encontrado");
            
            const retorno = await servico.delete(connection, id);
            connection.commit();
            return retorno;
        } catch (error) {
            connection.rollback();
            throw error;
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
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default ServicoController;
