import DatabaseManager from "../config/database";
import Atendente from "../models/atendente";
import Empresa from '../models/empresa';

class EmpresaController {

    empresa: typeof Empresa;

    constructor() {
        this.empresa = Empresa;
    }

    async criarEmpresa(dados) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();
            const empresaModel = new Empresa(dados.nome, dados.nome_fantasia, dados.email, dados.cnpj, dados.cidade, dados.endereco, dados.estado, dados.telefone, dados.senha, dados.empresa_user_id);
            await empresaModel.create(connection);
            connection.commit();
            return empresaModel;
        } catch (error) {
            connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async atualizarEmpresa(id: number, dados: any) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();

            const empresaModel = new Empresa("", "", "", "", "", "", "", "", "", 0);
            const empresaExistente = await empresaModel.buscaEmpresa(id, connection);

            if (!empresaExistente.length) {
                return null;
            }
            const empresaAtualizada = await Empresa.update(id, dados, connection);
            connection.commit();
            return empresaAtualizada;
        } catch (error) {
            connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async deletarEmpresa(id: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const empresaModel = new Empresa("", "", "", "", "", "", "", "", "", 0);
            const empresaExistente = await empresaModel.buscaEmpresa(id, connection);
            if (!empresaExistente.length) {
                return null;
            }
            const empresaExcluida = await Empresa.delete(id, connection);
            connection.commit();
            return empresaExcluida;
        } catch (error) {
            connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async buscarEmpresa(id: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const empresaModel = new Empresa("","", "", "", "", "", "", "", "", 0);
            const empresaExistente = await empresaModel.buscaEmpresa(id, connection);
            if (!empresaExistente.length) {
                return null;
            }
            return empresaExistente;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async getEmpresaByUserId(id: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const result = await Empresa.getUserById(id, connection);
            if (!result.length) {
                throw new Error("Empresa não encontrada");
            }
            return result;
        } catch (e) {
            throw e;
        }
    }

    async listarEmpresas() {
        const connection = await DatabaseManager.getInstance().getConnection();
        const query = `SELECT * FROM empresa`;

        try {
            const [empresas] = await connection.execute(query);
            return empresas;
        } catch (error) {
            throw new Error('Erro ao listar empresas');
        } finally {
            connection.release();
        }
    }

    async adicionarFuncionario(cpf: string, empresaId: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();

            const empresaModel = new Empresa("", "", "", "", "", "", "", "", "", 0);
            const retorno = empresaModel.adicionaAtendente(connection, cpf, empresaId);
            connection.commit();
            return retorno;
        } catch (error) {
            connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async listarServicoEmpresa(id: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const servicos = await Empresa.listarServicoEmpresa(id, connection);
            if (servicos)
                return servicos;

            throw new Error("Nenhum atendente encontrado");
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async getFunc(id: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const funcionarios = await Empresa.getFuncionarios(id, connection);
            const dadosFuncionarios = [];
            if (funcionarios && funcionarios.length > 0) {
                for (const func of funcionarios) {
                    const dados = await Atendente.getUserAtendentes(func.atendente_user_id, connection);
                    dadosFuncionarios.push({
                        ...dados[0],
                        cpf: func.cpf,
                        atendente_id: func.id
                    });
                }
                return dadosFuncionarios;
            }
            throw new Error("Nenhum atendente encontrado");
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async getEmpresaByName(nome:string){
        const connection = await DatabaseManager.getInstance().getConnection();
        try{
            const empresa = await Empresa.getEmpresaByName(nome, connection);
            if(empresa && empresa.length > 0)
                return empresa;
            throw new Error("Nenhuma empresa encontrada");
        }catch(error){
            throw error;
        }finally{
            connection.release();
        }

    }
}

export default EmpresaController;