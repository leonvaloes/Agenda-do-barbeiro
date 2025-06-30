import DatabaseManager from "../config/database";
import Atendente from "../models/atendente";
import Empresa from "../models/empresa";
import Servico from '../models/servicos';
import AtendenteController from "./atendenteController";

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
            return servicoId;
        } catch (error) {
            connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async atualizarServico(id: number, dados: any) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();
            const servico = await Servico.getServicoById(id, connection);
            if (!servico) {
                throw new Error("Serviço não encontrado");
            }
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

    async deleteServFunc(Servid: number, EmpresaId: number, funcionarios: any[]) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();
            const empresa = await Empresa.getEmpresaByUserId(EmpresaId, connection);

            for (const funcionario of funcionarios) {
                const atendente = await Atendente.getAtendenteByUser(funcionario.id, connection);
                if (!atendente) {
                    throw new Error("Atendente não encontrado");
                }
                await Servico.deleteServFunc(connection, Servid, empresa[0].id, atendente.id);
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async addFuncServ(Servid: number, EmpresaId: number, funcionarios: any[]) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();
            const empresa = await Empresa.getEmpresaByUserId(EmpresaId, connection);
            for (const funcionario of funcionarios) {
                const atendente = await Atendente.getAtendenteByUser(funcionario, connection);
                if (!atendente) {
                    throw new Error("Atendente não encontrado");
                }
                await Servico.addFuncServ(connection, Servid, empresa[0].id, atendente.id);
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }


    async criarEassociar(data: any) {
        const { descricao, nome, tempo_medio, valor, funcionarios } = data;
        const atendenteController = new AtendenteController();
        try {
            const servicosCriados = [];
            const dados = { descricao, nome, tempo_medio, valor };
            await atendenteController.criarServicoEAssociar(dados, data.funcionarios);
            return servicosCriados;
        } catch (e) {
            throw e;
        }
    }

    async deletarServico(id) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();
            const servico = await Servico.getServicoById(id, connection);
            if (!servico)
                throw new Error("Serviço não encontrado");

            const retorno = Servico.delete(connection, id);
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
            const servicos = await Servico.listarServicos(connection);
            return servicos;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async getEmpresa(id: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const empresa = await Servico.getEmpresa(id, connection);
            return empresa;
        } catch (e) {
            throw e;
        } finally {
            connection.release();
        }
    }
}

export default ServicoController;
